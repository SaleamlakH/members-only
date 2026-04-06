import pool from '../pool';
import type { MessageGroupRelation } from '@/types/db';

// filter all messages of a group
const getGroupMessages = async (groupId: MessageGroupRelation['groupId']) => {
  const { rows } = await pool.query(
    'SELECT * FROM messages WHERE id IN (SELECT message_id FROM group_messages WHERE group_id = $1);',
    [groupId],
  );

  return rows;
};

export { getGroupMessages };
