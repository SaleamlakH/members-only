import pool from '../pool';
import type { User } from '@/types/db';

type UserCreate = Pick<User, 'username' | 'email' | 'password'>;
type UserProfileUpdate = Pick<User, 'id' | 'username' | 'email'>;
type UserPasswordUpdate = Pick<User, 'id' | 'password'>;

// account creation inserts username, email, and password to users table
const createUser = async ({ username, email, password }: UserCreate) => {
  return pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3);', [
    username,
    email,
    password,
  ]);
};

const getUserById = async (id: User['id']): Promise<User | undefined> => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
  return rows[0];
};

const getUserByEmail = async (email: User['email']): Promise<User | undefined> => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
  return rows[0];
};

const getUserByUsername = async (username: User['username']): Promise<User | undefined> => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1;', [[username]]);
  return rows[0];
};

// delete account remove a user from users table
const deleteUser = async (id: User['id']) => {
  return pool.query('DELETE FROM users WHERE id = $1;', [id]);
};

// update user
const updateProfileInfo = async ({ id, username, email }: UserProfileUpdate) => {
  return pool.query('UPDATE users SET username = $1, email = $2 WHERE id = $3;', [
    username,
    email,
    id,
  ]);
};

const updatePassword = async ({ id, password }: UserPasswordUpdate) => {
  return pool.query('UPDATE users SET password = $1 WHERE id = $2;', [password, id]);
};

export {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  deleteUser,
  updateProfileInfo,
  updatePassword,
};
