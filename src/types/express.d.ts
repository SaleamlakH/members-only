import DB from './db';

declare global {
  namespace Express {
    interface User extends DB.User {}
  }
}
