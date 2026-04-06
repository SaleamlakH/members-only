import userCreatePost from '@/controllers/signupController';
import { Router } from 'express';

const signupRouter = Router();

signupRouter.post('/', ...userCreatePost);

export default signupRouter;
