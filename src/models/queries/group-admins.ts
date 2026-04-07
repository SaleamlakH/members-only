import type { PoolClient } from 'pg';
import pool from '../pool';
import type { UserGroupRelation } from '@/types/db';

const table = 'group_admins';

const addAdmin = async ({ userId, groupId }: UserGroupRelation, client?: PoolClient) => {
  const dbClient = client || pool;
  return dbClient.query(`INSERT INTO ${table} (user_id, group_id) VALUES ($1, $2);`, [
    userId,
    groupId,
  ]);
};

const deleteAdmin = async ({ userId, groupId }: UserGroupRelation) => {
  return pool.query(`DELETE FROM ${table} WHERE user_id = $1 AND group_id = $2;`, [
    userId,
    groupId,
  ]);
};

// check if a user is a member
const isAdmin = async ({ userId, groupId }: UserGroupRelation) => {
  const { rowCount } = await pool.query(
    `SELECT 1 FROM ${table} WHERE user_id = $1 AND group_id = $2 LIMIT 1;`,
    [userId, groupId],
  );

  return rowCount;
};

export { addAdmin, deleteAdmin, isAdmin };
