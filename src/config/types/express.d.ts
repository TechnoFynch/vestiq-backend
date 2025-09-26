import type { AuthUserType } from 'src/auth/types/auth-user.type';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUserType;
  }
}
