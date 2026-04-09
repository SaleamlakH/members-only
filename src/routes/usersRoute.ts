import { Router, type NextFunction, type Request, type Response } from 'express';
import * as userController from '@/controllers/usersController';

const usersRouter = Router();

// get user page including posts
usersRouter.get('/profile', userController.usersGet);

// update user profile
usersRouter.put('/settings/profile', ...userController.usersProfileUpdate);

// change password
usersRouter.put('/settings/password', ...userController.usersPasswordChange);

usersRouter.get('/settings', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/settings', { title: 'Settings' });
});

// delete account
usersRouter.delete('/settings', userController.usersDeleteAccount);

export default usersRouter;
