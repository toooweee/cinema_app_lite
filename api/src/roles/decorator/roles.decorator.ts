import { SetMetadata } from '@nestjs/common';
import Roles from '@roles/types/roles.enum';

export const ROLES_KEY = 'roles';
export const ROLES = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
