import pool from '../pool';

// account creation inserts username, email, and password to users table
const createUser = async (username: string, email: string, password: string) => {
  return pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [
    username,
    email,
    password,
  ]);
};

// delete account remove a user from users table
const deleteUser = async (userId: number) => {
  return pool.query('DELETE FROM users WHERE id = $1', [userId]);
};

export { createUser, deleteUser };
