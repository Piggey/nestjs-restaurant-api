import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { ClientPrincipalDto } from '../dto';

export const CLIENT_PRINCIPAL_HEADER = 'x-ms-client-principal';

export const ClientPrincipal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ClientPrincipalDto => {
    const req = ctx.switchToHttp().getRequest<Request>();

    if (!req.headers[CLIENT_PRINCIPAL_HEADER]) {
      throw new HttpException(
        `${CLIENT_PRINCIPAL_HEADER} request header not provided`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const client = getClientPrincipalFromHeader(req);
    if (client.userRoles.length === 0) {
      throw new HttpException(
        'no custom userRole specified',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (client.userRoles.length > 1) {
      throw new HttpException(
        'too many custom roles specified',
        HttpStatus.BAD_REQUEST,
      );
    }

    return client;
  },
);

export const getClientPrincipalFromHeader = (
  req: Request,
): ClientPrincipalDto => {
  if (!req.headers[CLIENT_PRINCIPAL_HEADER])
    throw new HttpException(
      `${CLIENT_PRINCIPAL_HEADER} request header not provided`,
      HttpStatus.FORBIDDEN,
    );

  const encoded = Buffer.from(req.headers[CLIENT_PRINCIPAL_HEADER], 'base64');
  const decoded = encoded.toString();
  const client = JSON.parse(decoded);
  client.userRoles = client.userRoles.filter(
    (role) => role !== 'anonymous' && role !== 'authenticated',
  );

  return client;
};
