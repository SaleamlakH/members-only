import type { NextFunction, Request, Response } from 'express';
import { body, validationResult, matchedData } from 'express-validator';
import * as db from '@/models/db-queries';
import mapValidationErrors from '@/utils/mapValidationErrors';

const isGroupNameTaken = async (name: string) => {
  const group = await db.groups.getGroupByName(name);
  if (group) {
    throw new Error('Group name is already taken');
  }
};

const createGroupValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Group name is required')
    .isLength({ min: 3 })
    .withMessage('Group name must be at least 3 characters')
    .custom(isGroupNameTaken),
  body('about')
    .optional(true)
    .trim()
    .isLength({ max: 255 })
    .withMessage('About must be less than 255 characters'),
];

const groupsCreatePost = [
  createGroupValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = mapValidationErrors(errors);

      // embed errors to the group creating form
      res.status(400).render('pages/create-group', {
        title: 'Create Group',
        data: req.body,
        errors: validationErrors,
      });
      return;
    }

    const { name, about } = matchedData(req);
    const group = await db.transaction.createGroup({ name, ownerId: req.user!.id, about });

    // redirect
    res.status(200).json({ group });
    // res.redirect(`/groups/${group.id}`);
  },
];

const messagePostValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must be lower than 255 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 255 })
    .withMessage('Content must be lower than 255 characters'),
];

const groupsMessagePost = [
  messagePostValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const { groupId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = mapValidationErrors(errors);

      // render group page with filled post form
      res.status(400).json({ validationErrors });
    }

    try {
      // insert into database
      const { title, content } = matchedData(req);
      await db.transaction.createGroupMessage({
        title,
        content,
        authorId: req.user!.id,
        groupId: +groupId!,
      });

      // redirect
      res.redirect(`/groups/${groupId}`);
    } catch (error) {
      next(error);
    }
  },
];

const groupGet = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params;

  try {
    const group = await db.groups.getGroupById(Number(groupId));

    const isMember = req.user
      ? (await db.groupMembers.isMember({ userId: req.user.id, groupId: Number(groupId) })) === 1
      : false;

    const messages = isMember
      ? await db.groupMessages.getGroupMessagesWithAuthor(Number(groupId))
      : await db.groupMessages.getGroupMessages(Number(groupId));

    // render group page
    res.status(200).json({ group, messages });
    // res.status(200).render('group', { group, messages});
  } catch (error) {
    next(error);
  }
};

const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await db.groups.getAllGroups();
    res.render('pages/groups-list', { title: 'Groups', groups: groups, user: req.user!.id });
  } catch (error) {
    next(error);
  }
};

export { groupsCreatePost, groupsMessagePost, groupGet, getGroups };
