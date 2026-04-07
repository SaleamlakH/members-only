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

const validator = [
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
  validator,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = mapValidationErrors(errors);

      // embed errors to the group creating form
      res.status(400).json(validationErrors);
      // res.status(400).render('group-create-from', {errors: validationErrors})
    }

    const { name, about } = matchedData(req);
    await db.groups.createGroup({ name, ownerId: req.user!.id, about });

    // redirect
    res.status(200).json({ name, about });
    //res.status(200).render('group', { name, about });
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
      ? db.groupMessages.getGroupMessagesWithAuthor(Number(groupId))
      : db.groupMessages.getGroupMessages(Number(groupId));

    // render group page
    res.status(200).json({ group, messages });
    // res.status(200).render('group', { group, messages});
  } catch (error) {
    next(error);
  }
};

export { groupsCreatePost, groupGet };
