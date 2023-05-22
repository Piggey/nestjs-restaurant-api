import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleLevel, UserRoles } from '../model';
import { extractTokenFromHeader, getUserFromToken } from '../decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const requiredRole = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    )[0];

    const token = extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await getUserFromToken(token);
    return this.validateClientRoles(user.userRole as UserRoles, requiredRole);
  }

  private validateClientRoles(
    clientRole: UserRoles,
    minRole: UserRoles,
  ): boolean {
    return UserRoleLevel[clientRole] >= UserRoleLevel[minRole];
  }
}
