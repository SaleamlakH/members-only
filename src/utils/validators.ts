import { body, type CustomValidator } from 'express-validator';
import bcrypt from 'bcryptjs';
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

  confirmPassword: body('confirm_password')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password must match password');
      }

      return true;
    }),

  currentPassword: body('current_password')
    .trim()
    .custom(async (current_password, meta) => {
      const req = meta.req as Request;

      const user = await db.users.getUserById(req.user!.id);
      const match = await bcrypt.compare(current_password, user!.password);

      if (!match) {
        throw new Error('Incorrect password');
      }
    }),
};

// filter validators
const { currentPassword, ...signup } = userDataValidators;
const { username, email, ...passwordValidators } = userDataValidators;

export const signUpValidator = Object.values(signup);
export const profileUpdateValidator = [userDataValidators.username, userDataValidators.email];
export const passwordUpdateValidator = Object.values(passwordValidators);
