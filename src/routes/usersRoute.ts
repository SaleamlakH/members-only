import { Router } from 'express';

// users/:id
// users/:id/settings

const usersRouter = Router();

// get user profile
usersRouter.get('/:userId');

// update user profile
usersRouter.put('/:userId/setting/profile');

// change password
usersRouter.put('/:userId/setting/password');

// delete account
usersRouter.delete('/:userId');

export default usersRouter;
