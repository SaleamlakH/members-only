import { Router } from 'express';
import * as groupsController from '@/controllers/groupsController';

// /
// /create
// /:id
// /about

const groupsRouter = Router();

// create new group
groupsRouter.post('/create', ...groupsController.groupsCreatePost);

// post message
groupsRouter.post("/:groupId", ...groupsController.groupsMessagePost)

// get group page
groupsRouter.get('/:groupId', groupsController.groupGet);

export default groupsRouter;
