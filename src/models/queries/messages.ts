import pool from '../pool';
import type { Messages } from '@/types/db';

const table = 'messages';

type MessageCreate = Pick<Messages, 'title' | 'content' | 'authorId'>;
type MessageUpdate = Pick<Messages, 'id' | 'title' | 'content'>;

const createMessage = async ({ title, content, authorId }: MessageCreate) => {
  return pool.query(`INSERT INTO ${table} (title, content, author_id) VALUES ($1, $2, $2);`, [
    title,
    content,
    authorId,
  ]);
};

const getMessage = async (id: Messages['id']): Promise<Messages> => {
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
