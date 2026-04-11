import * as db from '@/models/db-queries';
import type { GroupCreate, MessageGroupTransaction } from '@/types/db';
import pool from '../pool';

// create a message and store the ownerId and returned groupId
const createGroup = async ({ name, ownerId, about }: GroupCreate) => {
  const client = await pool.connect();
  try {
    // start transaction
    await client.query('BEGIN;');

    // insert group
    const group = await db.groups.createGroup({ name, ownerId, about: about ?? '' }, client);

    // add owner as admin
    await db.groupAdmins.addAdmin({ userId: ownerId, groupId: group.id }, client);

    // add owner as member
    await db.groupMembers.addMember({ userId: ownerId, groupId: group.id }, client);

    await client.query('COMMIT;');
    return group;
  } catch (error) {
    await client.query('ROLLBACK;'); // undo everything
    throw error;
  } finally {
    client.release();
  }
};

// create a message and store group id and returned message id
const createGroupMessage = async ({ content, authorId, groupId }: MessageGroupTransaction) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN;'); // start transaction

    // store message in messages table
    const message = await db.messages.createMessage({ content, authorId }, client);

    // store groupId and messageId in group_messages table
    await db.groupMessages.addGroupAndMessageIds({ groupId, messageId: message.id }, client);

    await client.query('COMMIT;');
  } catch (error) {
    await client.query('ROLLBACK;');
    throw error;
  } finally {
    client.release();
  }
};

export { createGroupMessage, createGroup };
