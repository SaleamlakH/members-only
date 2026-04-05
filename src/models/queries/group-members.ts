import type { UserGroupRelation } from '@/types/db';
import pool from '../pool';

const table = `group_messages`;

const addMember = async ({ userId, groupId }: UserGroupRelation) => {
  return pool.query(`INSERT INTO ${table} (user_id, group_id) VALUES ($1, $2);`, [userId, groupId]);
};

const deleteMembers = async ({ userId, groupId }: UserGroupRelation) => {
  return pool.query(`DELETE FROM ${table} WHERE user_id = $1 AND group_id = $2;`, [
    userId,
    groupId,
  ]);
};

// check if a user is a member
const isMember = async ({ userId, groupId }: UserGroupRelation) => {
  const { rowCount } = await pool.query(
    `SELECT 1 FROM ${table} WHERE user_id = $1 AND group_id = $2 LIMIT 1;`,
    [userId, groupId],
  );

  return rowCount;
};

export { addMember, deleteMembers, isMember };
