import type { NextFunction, Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcryptjs';
import { passwordUpdateValidator, profileUpdateValidator } from '@/utils/validators';
import * as db from '@/models/db-queries';
import mapValidationErrors from '@/utils/mapValidationErrors';

// get user page including message  posts
const usersGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.users.getUserById(req.user!.id);
    const messages = await db.messages.getMessageByAuthor(req.user!.id);

    // render user
    res.status(200).json({ messages, username: user?.username });
    // res.render('user', { messages, username: user?.username });
  } catch (error) {
    next(error);
  }
};

const usersProfileUpdate = [
  profileUpdateValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = mapValidationErrors(errors);

      // render the update form
      res.status(400).json({ validationErrors });
      // res.status(400).render('users-setting', { errors: validationErrors });
      return;
    }

    try {
      const { username, email } = matchedData(req);
      await db.users.updateProfileInfo({ id: req.user!.id, username, email });

      // redirect to profile settings
      res.redirect(`/users/${req.user!.id}/setting`);
    } catch (error) {
      next(error);
    }
  },
];

const usersPasswordChange = [
  passwordUpdateValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = mapValidationErrors(errors);

      // embed errors to the form
      res.status(400).json({ errors: validationErrors });
      // res.status(400).render(`users/${req.user!.id}/setting`);
      return;
    }

    try {
      const { password } = matchedData(req);

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.users.updatePassword({ id: req.user!.id, password: hashedPassword });

      // redirect with notification
      res.redirect(`users/${req.user!.id}/setting`);
    } catch (error) {
      next(error);
    }
  },
];

export { usersGet, usersProfileUpdate, usersPasswordChange };
