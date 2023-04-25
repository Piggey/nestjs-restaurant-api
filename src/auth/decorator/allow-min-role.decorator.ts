import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../model';

/**
 * selects the minimum `UserRole` required to access a specific endpoint
 */
export const AllowMinRole = (...roles: UserRoles[]) =>
  SetMetadata('roles', roles);
