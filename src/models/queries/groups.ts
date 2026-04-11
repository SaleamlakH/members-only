import type { PoolClient } from 'pg';
import pool from '../pool';
import type { GroupCreate, Groups, GroupUpdate } from '@/types/db';

const createGroup = async (
  { name, ownerId, about }: GroupCreate,
  client?: PoolClient,
): Promise<Groups> => {
  const dbClient = client || pool;
  const { rows } = await dbClient.query(
    `
    INSERT INTO groups (name, owner_id, about) 
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [name, ownerId, about],
  );

  return rows[0];
};

const getGroupById = async (id: Groups['id']): Promise<Groups | undefined> => {
  const { rows } = await pool.query('SELECT * FROM groups WHERE id = $1;', [id]);
  return rows[0];
};

const getGroupByName = async (name: Groups['name']): Promise<Groups | undefined> => {
  const { rows } = await pool.query('SELECT * FROM groups WHERE name ILIKE $1;', [name]);
  return rows[0];
};

const getAllGroups = async (): Promise<Groups[]> => {
  const { rows } = await pool.query('SELECT * FROM groups;');
  return rows;
};

const updateGroup = async ({ id, name, about }: GroupUpdate) => {
  return pool.query('UPDATE groups SET name = $1, about = $2 WHERE id = $3;', [name, about, id]);
};

const deleteGroup = async (id: Groups['id']) => {
  return pool.query('DELETE FROM groups WHERE id = $1;', [id]);
};

export { createGroup, getGroupById, getGroupByName, getAllGroups, updateGroup, deleteGroup };
