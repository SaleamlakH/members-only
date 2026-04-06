import pool from '../pool';
import type { Groups } from '@/types/db';

type GroupCreate = Pick<Groups, 'name' | 'ownerId' | 'about'>;
type GroupUpdate = Pick<Groups, 'id' | 'name' | 'about'>;

const createGroup = async ({ name, ownerId, about }: GroupCreate) => {
  return pool.query('INSERT INTO groups (name, owner_id) VALUES ($1, $2);', [name, ownerId, about]);
};

const getGroup = async (id: Groups['id']): Promise<Groups | undefined> => {
  const { rows } = await pool.query('SELECT * FROM groups WHERE id = $1;', [id]);
  return rows[0];
};

const updateGroup = async ({ id, name, about }: GroupUpdate) => {
  return pool.query('UPDATE groups SET name = $1, about = $2 WHERE id = $3;', [name, about, id]);
};

const deleteGroup = async (id: Groups['id']) => {
  return pool.query('DELETE FROM groups WHERE id = $1;', [id]);
};

export { createGroup, getGroup, updateGroup, deleteGroup };
