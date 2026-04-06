import userCreatePost from '@/controllers/signupController';
import type { FormValidationError } from '@/types/validation';
import { Router, type Request, type Response } from 'express';
import type { FieldValidationError } from 'express-validator';

const signupRouter = Router();

signupRouter.post('/', ...userCreatePost, (req: Request, res: Response) => {
  // map errors
  const validationErrors = (res.locals['errors'] as FieldValidationError[]).reduce(
    (errors, { value, msg, path }: FieldValidationError) => {
      errors[path] = { value, message: msg };
      return errors;
    },
    {} as FormValidationError,
  );

  // comment out and remove json response when the view is ready
  res.status(400).json({ data: req.body, errors: validationErrors });
  // res.status(400).render('signup-form', { data: req.body, errors: validationErrors });
});

export default signupRouter;
