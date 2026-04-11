import type { NextFunction, Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import * as db from '@/models/db-queries';
import mapValidationErrors from '@/utils/mapValidationErrors';
import { createGroupValidator, messagePostValidator } from '@/utils/validators';

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
      const { message } = matchedData(req);
      await db.transaction.createGroupMessage({
        content: message,
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

    // type and database inconsistency
    const { owner_id: ownerId } = group as any;
    const isOwner = req.user ? req.user.id === ownerId : false;

    const isMember = req.user
      ? (await db.groupMembers.isMember({ userId: req.user.id, groupId: Number(groupId) })) === 1
      : false;

    const messages = isMember
      ? await db.groupMessages.getGroupMessagesWithAuthor(Number(groupId))
      : await db.groupMessages.getGroupMessages(Number(groupId));

    // render group page
    res.render('pages/group', {
      title: group?.name,
      user: req.user,
      group,
      messages,
      isMember,
      isOwner,
    });
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

const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params;

  try {
    await db.groupMembers.addMember({ userId: req.user!.id, groupId: Number(groupId) });
    res.redirect(`/groups/${groupId}`);
  } catch (error) {
    next(error);
  }
};

export { groupsCreatePost, groupsMessagePost, groupGet, getGroups, joinGroup };
