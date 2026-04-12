import { Router, type NextFunction, type Request, type Response } from 'express';
import * as groupsController from '@/controllers/groupsController';

const groupsRouter = Router();

// get group lists
groupsRouter.get('/', groupsController.getGroups);

// get group creation form
groupsRouter.get('/create', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/create-group', { title: 'Create Group', user: req.user!.id });
});

// create new group
groupsRouter.post('/create', ...groupsController.groupsCreatePost);

// post message
groupsRouter.post('/:groupId', ...groupsController.groupsMessagePost);

// get group page
groupsRouter.get('/:groupId', groupsController.groupGet);

groupsRouter.get('/:groupId/join', groupsController.joinGroup);

groupsRouter.get('/:groupId/leave', groupsController.leaveGroup);

// delete group
groupsRouter.get('/:groupId/delete', groupsController.deleteGroup);
groupsRouter.delete('/:groupId', groupsController.deleteGroup);

// delete groups message
groupsRouter.get('/:groupId/messages/:messageId/delete', groupsController.deleteMessage);
groupsRouter.delete('/:groupId/messages/:messageId', groupsController.deleteMessage);

export default groupsRouter;
