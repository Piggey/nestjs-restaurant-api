import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../dto';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
