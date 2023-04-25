import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { getClientPrincipalFromHeader } from '.';
import { UserRoles } from '../model';

export const Role = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserRoles => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const clientPrincipal = getClientPrincipalFromHeader(req);
    return clientPrincipal.userRoles.at(0);
  },
);
