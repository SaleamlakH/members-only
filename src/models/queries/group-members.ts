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

export { addMember, deleteMembers };
