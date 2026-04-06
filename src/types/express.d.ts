import { SafeUser } from './db';

declare global {
  namespace Express {
    interface User extends SafeUser {}
  }
}
