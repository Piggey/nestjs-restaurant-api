import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { UserAuthDto } from '../dto';

export const CLIENT_PRINCIPAL_HEADER = 'x-ms-client-principal';

export const ClientPrincipal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserAuthDto => {
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

export const getClientPrincipalFromHeader = (req: Request): UserAuthDto => {
  if (!req.headers[CLIENT_PRINCIPAL_HEADER])
    throw new HttpException(
      `${CLIENT_PRINCIPAL_HEADER} request header not provided`,
      HttpStatus.FORBIDDEN,
    );

  const encoded = Buffer.from(req.headers[CLIENT_PRINCIPAL_HEADER], 'base64');
  const decoded = encoded.toString();

  let client: UserAuthDto;
  try {
    client = JSON.parse(decoded);
  } catch (error) {
    if (error instanceof SyntaxError)
      throw new HttpException(
        `could not parse ${CLIENT_PRINCIPAL_HEADER}`,
        HttpStatus.BAD_REQUEST,
      );
  }

  client.userRoles = client.userRoles.filter(
    (role) => role !== 'anonymous' && role !== 'authenticated',
  );

  return client;
};
