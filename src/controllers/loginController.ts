import mapValidationErrors from '@/utils/mapValidationErrors';
import type { NextFunction, Request, Response } from 'express';
import { body, matchedData, validationResult } from 'express-validator';

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

const loginPost = [
  validator,
  validationErrorHandler,
  (req: Request, res: Response) => {
    res.json(req.body);
  },
];

export default loginPost;
