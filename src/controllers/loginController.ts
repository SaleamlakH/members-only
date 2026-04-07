import mapValidationErrors from '@/utils/mapValidationErrors';
import type { NextFunction, Request, Response } from 'express';
import { body, matchedData, validationResult } from 'express-validator';
import passport from 'passport';
import type { IVerifyOptions } from 'passport-local';

const validator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Incorrect email format')
    .toLowerCase(),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // map errors and send back the form
    const validationErrors = mapValidationErrors(errors);

    // comment out and remove json response when the view is ready
    res.status(400).json({ errors: validationErrors });
    // res.status(400).render('login-form', { data: req.body, errors: validationErrors });
    return;
  }

  const { email } = matchedData(req);
  req.body.email = email;
  next();
};

const authenticateLogin = async (req: Request, res: Response, next: NextFunction) => {
  await passport.authenticate(
    'local',
    (err: any, user: false | Express.User | undefined, info: IVerifyOptions) => {
      if (err) throw err;

      if (user) {
        // redirect
        // log in and redirect
        return req.login(user, (err) => {
          if (err) throw err;

          // must be replaced with render after we have the view
          res.status(200).json({ user, msg: 'successfully logged in' });
        });
      }

      if (info.message) {
        res.status(401).json({ data: req.body, authErrorMsg: info.message });
        // embed error into the login form
        // res.status(401).render('login-form', {data: req.body, authError: info.message })
      }
    },
  )(req, res, next);
};

const loginPost = [validator, validationErrorHandler, authenticateLogin];

export default loginPost;
