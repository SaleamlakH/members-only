import type { NextFunction, Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcryptjs';
import { passwordUpdateValidator, profileUpdateValidator } from '@/utils/validators';
import * as db from '@/models/db-queries';
import mapValidationErrors from '@/utils/mapValidationErrors';

// get user page including message  posts
const usersGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.users.getUserById(req.user!.id);
    const ownedGroups = await db.groups.getGroupsByOwner(user!.id);
    const joinedGroups = await db.groups.getAllGroupsOfMember(user!.id);
    const groups = { owned: ownedGroups, joined: joinedGroups };

    // get all messages of a user from fetched groups
    const messages = await [...ownedGroups, ...joinedGroups].reduce(
      async (extendedMessages, group) => {
        const groupMessages = await db.groupMessages.getGroupMessagesByAuthor({
          authorId: user!.id,
          groupId: group.id,
        });

        const { name, id } = group;
        // extend message to include group name and id

        extendedMessages = [
          ...(await extendedMessages),
          ...groupMessages.map((message) => {
            return { ...message, group: { name, id } };
          }),
        ];

        return extendedMessages;
      },
      [] as any,
    );

    // render user profile
    res.render('pages/profile', { title: `Profile| ${user?.username}`, user, groups, messages });
  } catch (error) {
    next(error);
  }
};

// get user setting
const usersSettingsGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.users.getUserById(req.user!.id);
    const profile = {
      username: user?.username,
      email: user?.email,
    };

    res.render('pages/settings', { title: 'Settings', user: req.user, profile });
  } catch (error) {
    next(error);
  }
};

const usersProfileUpdate = [
  profileUpdateValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = mapValidationErrors(errors);

      // send the json response
      res.status(400).json({ data: req.body, errors: validationErrors });
      return;
    }

    try {
      const { username, email } = matchedData(req);
      await db.users.updateProfileInfo({ id: req.user!.id, username, email });

      // send success status
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
];

const usersPasswordChange = [
  passwordUpdateValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = mapValidationErrors(errors);

      // incorrect current password
      if (validationErrors['current_password']) {
        res.status(401).send();
        return;
      }

      res.status(400).json({ errors: validationErrors });
      return;
    }

    try {
      const { password } = matchedData(req);

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.users.updatePassword({ id: req.user!.id, password: hashedPassword });

      // send ok
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
];

const usersDeleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.users.deleteUser(req.user!.id);

    // logout and redirect to a home with success notification
    req.logOut((err) => {
      if (err) {
        return next(err);
      }

      res.redirect('/');
    });
  } catch (error) {
    next(error);
  }
};

export { usersGet, usersSettingsGet, usersProfileUpdate, usersPasswordChange, usersDeleteAccount };
