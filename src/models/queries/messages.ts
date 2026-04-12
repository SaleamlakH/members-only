import type { PoolClient } from 'pg';
import pool from '../pool';
import type { MessageCreate, Messages, MessageUpdate } from '@/types/db';

const table = 'messages';

const createMessage = async (
  { content, authorId }: MessageCreate,
  client?: PoolClient,
): Promise<Messages> => {
  const dbClient = client || pool;
  const { rows } = await dbClient.query(
    `
    INSERT INTO ${table} (content, author_id) 
    VALUES ($1, $2)
    RETURNING *;`,
    [content, authorId],
  );

  return rows[0];
};

const getMessageById = async (id: Messages['id']): Promise<Messages | undefined> => {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1;`, [id]);
  return rows[0];
};

const getMessageByAuthor = async (
  authorId: Messages['authorId'],
): Promise<Messages | undefined> => {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE author_id = $1;`, [authorId]);
  return rows[0];
};

const updateMessage = async ({ id, content }: MessageUpdate) => {
  return pool.query(`UPDATE ${table} SET content = $1 WHERE id = $2;`, [content, id]);
};

const deleteMessage = async (id: Messages['id'], client?: PoolClient) => {
  const dbClient = client || pool;
  return dbClient.query(`DELETE FROM ${table} WHERE id = $1;`, [id]);
};

export { createMessage, getMessageById, getMessageByAuthor, updateMessage, deleteMessage };
