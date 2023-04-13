import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { getClientPrincipalFromHeader } from 'src/user/decorator';
import { ClientRoleLevel, ClientRoles } from 'src/user/dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<ClientRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) return true; // no guard needed

    const req = context.switchToHttp().getRequest<Request>();
    const client = getClientPrincipalFromHeader(req);

    if (client.userRoles.length === 0 || client.userRoles.length > 1)
      return false;

    return this.validateClientRoles(client.userRoles[0], roles[0]);
  }

  private validateClientRoles(
    clientRole: ClientRoles,
    minRole: ClientRoles,
  ): boolean {
    return ClientRoleLevel[clientRole] >= ClientRoleLevel[minRole];
  }
}