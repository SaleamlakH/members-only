import pool from '../pool';
import DB from '@/types/db';

// account creation inserts username, email, and password to users table
const createUser = async ({ username, email, password }: DB.User) => {
  return pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3);', [
    username,
    email,
    password,
  ]);
};

const getUser = async ({ id }: DB.User) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
  return rows[0];
};

// delete account remove a user from users table
const deleteUser = async ({ id }: DB.User) => {
  return pool.query('DELETE FROM users WHERE id = $1;', [id]);
};

// update user
const updateProfileInfo = async ({ id, username, email }: DB.User) => {
  return pool.query('UPDATE users SET username = $1, email = $2 WHERE id = $3;', [
    username,
    email,
    id,
  ]);
};

const updatePassword = async ({ id, password }: DB.User) => {
  return pool.query('UPDATE users SET password = $1 WHERE id = $2;', [password, id]);
};

export { createUser, getUser, deleteUser, updateProfileInfo, updatePassword };
