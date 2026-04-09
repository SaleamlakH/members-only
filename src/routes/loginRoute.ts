import loginPost from '@/controllers/loginController';
import { Router, type NextFunction, type Request, type Response } from 'express';

const loginRouter = Router();

loginRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/login', { title: 'Login', errors: req.user });
});

loginRouter.post('/', ...loginPost);

export default loginRouter;
