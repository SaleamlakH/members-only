import { Router } from 'express';
import * as userController from '@/controllers/usersController';

const usersRouter = Router();

// get user page including posts
usersRouter.get('/profile', userController.usersGet);

// update user profile
usersRouter.put('/settings/profile', ...userController.usersProfileUpdate);

// change password
usersRouter.put('/settings/password', ...userController.usersPasswordChange);

usersRouter.get('/settings', userController.usersSettingsGet);

// delete account
usersRouter.delete('/settings', userController.usersDeleteAccount);

export default usersRouter;
