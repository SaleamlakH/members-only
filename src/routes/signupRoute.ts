import userCreatePost from '@/controllers/signupController';
import { Router, type NextFunction, type Request, type Response } from 'express';

const signupRouter = Router();

signupRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/signup', { title: 'Sign Up', path: '/signup' });
});

signupRouter.post('/', ...userCreatePost);

export default signupRouter;
