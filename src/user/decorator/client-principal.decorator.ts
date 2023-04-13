import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { ClientPrincipalDto } from '../dto';

export const ClientPrincipal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ClientPrincipalDto => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.headers['x-ms-client-principal']) {
      throw new HttpException(
        'x-ms-client-principal request header not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const encoded = Buffer.from(req.headers['x-ms-client-principal'], 'base64');
    const decoded = encoded.toString();

    const usr: ClientPrincipalDto = JSON.parse(decoded);
    usr.userRoles = usr.userRoles.filter(
      (role) => role !== 'anonymous' && role !== 'authenticated',
    );

    if (usr.userRoles.length === 0) {
      throw new HttpException(
        'no custom userRole specified',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (usr.userRoles.length > 1) {
      throw new HttpException(
        'too many custom roles specified',
        HttpStatus.BAD_REQUEST,
      );
    }

    return usr;
  },
);
