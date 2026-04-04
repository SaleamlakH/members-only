import pool from './pool';

// account creation inserts username, email, and password
// to users table
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

export { createUser };
