import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../user-old/model';

export const AllowRoles = (...roles: UserRoles[]) =>
  SetMetadata('roles', roles);
