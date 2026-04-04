import pool from '../pool';

// account creation inserts username, email, and password to users table
const createUser = async (username: string, email: string, password: string) => {
  return pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [
    username,
    email,
    password,
  ]);
};

const getUser = async (userId: number) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return rows[0];
};

// delete account remove a user from users table
const deleteUser = async (userId: number) => {
  return pool.query('DELETE FROM users WHERE id = $1', [userId]);
};

// update user
const updateProfileInfo = async (userId: number, username: string, email: string) => {
  return pool.query('UPDATE users SET username = $1, email = $2 WHERE id = $3', [
    username,
    email,
    userId,
  ]);
};

const updatePassword = async (userId: number, password: string) => {
  return pool.query('UPDATE users SET password = $1 WHERE id = $2', [password, userId]);
};

export { createUser, getUser, deleteUser, updateProfileInfo, updatePassword };
