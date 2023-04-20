import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../model';

export const AllowRoles = (...roles: UserRoles[]) =>
  SetMetadata('roles', roles);
