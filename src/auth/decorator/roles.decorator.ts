import { SetMetadata } from '@nestjs/common';
import { ClientRoles } from '../../user/dto';

export const Roles = (...roles: ClientRoles[]) => SetMetadata('roles', roles);
