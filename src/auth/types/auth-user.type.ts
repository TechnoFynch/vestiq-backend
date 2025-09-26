import { UserRoleEnum } from 'src/users/enums/user-role.enum';

export type AuthUserType = {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleEnum;
};
