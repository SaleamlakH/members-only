import type { PoolClient } from 'pg';
import pool from '../pool';
import type { GroupMessageWithAuthor, MessageGroupRelation, Messages } from '@/types/db';

// store group_id and message_id into group_messages
const addGroupAndMessageIds = async (
  { groupId, messageId }: MessageGroupRelation,
  client?: PoolClient,
) => {
  const dbClient = client || pool;
  return dbClient.query('INSERT INTO group_messages (group_id, message_id) VALUES ($1, $2);', [
    groupId,
    messageId,
  ]);
};

// filter all messages of a group
const getGroupMessages = async (groupId: MessageGroupRelation['groupId']): Promise<Messages[]> => {
  const { rows } = await pool.query(
    'SELECT * FROM messages WHERE id IN (SELECT message_id FROM group_messages WHERE group_id = $1);',
    [groupId],
  );

  return rows;
};

const getGroupMessagesWithAuthor = async (
  groupId: MessageGroupRelation['groupId'],
): Promise<GroupMessageWithAuthor[]> => {
  const { rows } = await pool.query(
    `
    SELECT messages.*, users.username as author
    FROM messages
    JOIN group_messages AS gm ON messages.id = gm.message_id
    JOIN users ON messages.author_id = users.id
    WHERE gm.group_id = $1;
    `,
    [groupId],
  );
  return rows;
};

export { addGroupAndMessageIds, getGroupMessages, getGroupMessagesWithAuthor };
