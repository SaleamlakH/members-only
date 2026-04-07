import { Router } from 'express';
import * as groupsController from '@/controllers/groupsController';

// /
// /create
// /:id
// /about

const groupsRouter = Router();

groupsRouter.post('/create', ...groupsController.groupsCreatePost);
groupsRouter.get('/:groupId', groupsController.groupGet);

export default groupsRouter;
