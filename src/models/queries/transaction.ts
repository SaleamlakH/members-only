import * as db from '@/models/db-queries';
import type { MessageGroupTransaction } from '@/types/db';

// create a message and
// store group id and returned message id
const createGroupMessage = async ({
  title,
  content,
  authorId,
  groupId,
}: MessageGroupTransaction) => {
  // store message in messages table
  const message = await db.messages.createMessage({ title, content, authorId });

  // store groupId and messageId in group_messages table
  return db.groupMessages.addGroupAndMessageIds({ groupId, messageId: message.id });
};

export { createGroupMessage };
