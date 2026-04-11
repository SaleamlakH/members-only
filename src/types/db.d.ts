export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export type SafeUser = Omit<User, 'password'>;
export type UserCreate = Pick<User, 'username' | 'email' | 'password'>;
export type UserProfileUpdate = Pick<User, 'id' | 'username' | 'email'>;
export type UserPasswordUpdate = Pick<User, 'id' | 'password'>;

export interface Groups {
  id: number;
  name: string;
  ownerId: number;
  about?: string;
  createdAt: Date;
}

export type GroupCreate = Pick<Groups, 'name' | 'ownerId' | 'about'>;
export type GroupUpdate = Pick<Groups, 'id' | 'name' | 'about'>;

export interface Messages {
  id: number;
  content: string;
  postedAt: Date;
  authorId: number;
}

export type MessageCreate = Pick<Messages, 'content' | 'authorId'>;
export type MessageUpdate = Pick<Messages, 'id' | 'content'>;

export interface UserGroupRelation {
  userId: number;
  groupId: number;
}

export interface MessageGroupRelation {
  groupId: number;
  messageId: number;
}

export interface GroupMessageWithAuthor extends Messages {
  author: Pick<User, 'username'>;
}

export interface MessageGroupTransaction extends MessageCreate {
  groupId: MessageGroupRelation['groupId'];
}
