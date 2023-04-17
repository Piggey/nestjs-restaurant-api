import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../user/model';

export const AllowRoles = (...roles: UserRoles[]) =>
  SetMetadata('roles', roles);
