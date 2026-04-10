import { body, type CustomValidator } from 'express-validator';
import * as db from '@/models/db-queries';
import type { Request } from 'express';

// User data Validation

const isUsernameTaken: CustomValidator = async (username, meta) => {
  const user = await db.users.getUserByUsername(username);
  const req = meta.req as Request;
  if (user) {
    // determining if user updating profile
    if (!req.user || req.user.id !== user.id) {
      throw new Error('Username already taken');
    }
  }
};

const isEmailExist: CustomValidator = async (email, meta) => {
  const user = await db.users.getUserByEmail(email);
  const req = meta.req as Request;

  if (user) {
    // determining if user updating profile
    if (!req.user || req.user.id !== user.id) {
      throw new Error('Email already exist');
    }
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
