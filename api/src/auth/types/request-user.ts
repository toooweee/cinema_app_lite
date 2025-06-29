import Roles from '@roles/types/roles.enum';

export interface RequestUser {
  sub: string;
  email: string;
  role: Roles;
  isActivated: boolean;
}
