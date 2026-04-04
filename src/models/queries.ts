import pool from './pool';

// account creation inserts username, email, and password to users table
const createUser = async (username: string, email: string, password: string) => {
  try {
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [
      username,
      email,
      password,
    ]);
  } catch (error) {
    throw error;
  }
};

// delete account remove a user from users table
const deleteUser = async (userId: number) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
  } catch (error) {
    throw error;
  }
};

export { createUser, deleteUser };
