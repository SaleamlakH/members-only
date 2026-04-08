import { body, type CustomValidator } from 'express-validator';
import * as db from '@/models/db-queries';

// User data Validation

const isUsernameTaken: CustomValidator = async (username) => {
  const user = await db.users.getUserByUsername(username);
  if (user) {
    throw new Error('Username already taken');
  }
};

const isEmailExist: CustomValidator = async (email) => {
  const user = await db.users.getUserByEmail(email);
  if (user) {
    throw new Error('Email already exist');
  }
};

// validations related to user data for signup and update
const userDataValidators = {
  username: body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .escape()
    .custom(isUsernameTaken),

  email: body('email').isEmail().withMessage('Invalid email address').custom(isEmailExist),

  password: body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
};

export const signUpValidator = Object.values(userDataValidators);
export const profileUpdateValidator = [userDataValidators.username, userDataValidators.email];
export const passwordUpdateValidator = [userDataValidators.password];
