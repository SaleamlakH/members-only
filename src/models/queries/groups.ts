import pool from '../pool';
import type { Groups } from '@/types/db';

const createGroup = async ({ name, ownerId, about }: Groups) => {
  return pool.query('INSERT INTO groups (name, owner_id) VALUES ($1, $2)', [name, ownerId, about]);
};

const getGroup = async ({ id }: Groups) => {
  const { rows } = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
  return rows[0];
};

const updateGroup = async ({ id, name, about }: Groups) => {
  return pool.query('UPDATE groups SET name = $1, about = $2 WHERE id = $3', [name, about, id]);
};

const deleteGroup = async ({ id }: Groups) => {
  return pool.query('DELETE FROM groups WHERE id = $1', [id]);
};

export { createGroup, getGroup, updateGroup, deleteGroup };
