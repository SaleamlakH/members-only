import type { PoolClient } from 'pg';
import pool from '../pool';
import type { MessageCreate, Messages, MessageUpdate } from '@/types/db';

const table = 'messages';

const createMessage = async (
  { title, content, authorId }: MessageCreate,
  client?: PoolClient,
): Promise<Messages> => {
  const dbClient = client || pool;
  const { rows } = await dbClient.query(
    `
    INSERT INTO ${table} (title, content, author_id) 
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [title, content, authorId],
  );

  return rows[0];
};

const getMessage = async (id: Messages['id']): Promise<Messages | undefined> => {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1;`, [id]);
  return rows[0];
};

const updateMessage = async ({ id, title, content }: MessageUpdate) => {
  return pool.query(`UPDATE ${table} SET title = $1, content = $2 WHERE id = $3;`, [
    title,
    content,
    id,
  ]);
};

const deleteMessage = async (id: Messages['id']) => {
  return pool.query(`DELETE FROM ${table} WHERE id = $1;`, [id]);
};

export { createMessage, getMessage, updateMessage, deleteMessage };
