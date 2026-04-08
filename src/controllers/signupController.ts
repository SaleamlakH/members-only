import type { NextFunction, Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcryptjs';
import * as db from '@/models/db-queries';
import type { UserCreate } from '@/types/db';
import mapValidationErrors from '@/utils/mapValidationErrors';
import { signUpValidator } from '@/utils/validators';

const userCreatePost = [
  signUpValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // map errors and send back the form
      const validationErrors = mapValidationErrors(errors);

      // comment out and remove json response when the view is ready
      res.status(400).json({ data: req.body, errors: validationErrors });
      // res.status(400).render('login-form', { data: req.body, errors: validationErrors });
      return;
    }

    // hash password
    const { username, email, password } = matchedData(req) as UserCreate;
    const hashedPassword = await bcrypt.hash(password, 10);

    // save it to database
    const user = await db.users.createUser({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // log in and redirect
    req.login(user, (err) => {
      if (err) throw err;

      // must be replaced with render after we have the view
      res.status(200).json(user);
    });
  },
];

export default userCreatePost;
