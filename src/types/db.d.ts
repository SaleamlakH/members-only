export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface Groups {
  id: number;
  name: string;
  ownerId: number;
  createdAt: Date;
}

export interface Messages {
  id: number;
  title: string;
  content: string;
  postedAt: Date;
  authorId: number;
}

export interface UserGroupRelation {
  userId: number;
  groupId: number;
}
