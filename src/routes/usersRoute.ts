import { Router } from 'express';
import * as userController from '@/controllers/usersController';

const usersRouter = Router();

// get user page including posts
usersRouter.get('/:userId', userController.usersGet);

// update user profile
usersRouter.put('/:userId/setting/profile', ...userController.usersProfileUpdate);

// change password
usersRouter.put('/:userId/setting/password', ...userController.usersPasswordChange);

// delete account
// usersRouter.delete('/:userId');

export default usersRouter;
