import loginPost from '@/controllers/loginController';
import { Router } from 'express';

const loginRouter = Router();

loginRouter.post('/', ...loginPost);

export default loginRouter;
