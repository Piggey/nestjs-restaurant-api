import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  createParamDecorator,
} from '@nestjs/common';
import { ClientPrincipalDto } from '../dto/client-principal.dto';

export const CLIENT_PRINCIPAL_HEADER = 'x-ms-client-principal';

export const ClientPrincipal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ClientPrincipalDto => {
    const req = ctx.switchToHttp().getRequest<Request>();
    Logger.log(`${req.method} ${req.url}, parsing ${CLIENT_PRINCIPAL_HEADER}`);
    return getClientPrincipalFromHeader(req);
  },
);

export const getClientPrincipalFromHeader = (
  req: Request,
): ClientPrincipalDto => {
  if (!req.headers[CLIENT_PRINCIPAL_HEADER]) {
    const err = new HttpException(
      `${CLIENT_PRINCIPAL_HEADER} request header not provided`,
      HttpStatus.BAD_REQUEST,
    );
    Logger.error(err);
    throw err;
  }

  const encoded = Buffer.from(req.headers[CLIENT_PRINCIPAL_HEADER], 'base64');
  const decoded = encoded.toString();

  let client: ClientPrincipalDto;
  try {
    client = JSON.parse(decoded);
  } catch (error) {
    if (error instanceof SyntaxError) {
      const err = new HttpException(
        `could not parse ${CLIENT_PRINCIPAL_HEADER}`,
        HttpStatus.BAD_REQUEST,
      );
      Logger.error(err);
      throw err;
    }
  }

  client.userRoles = client.userRoles.filter(
    (role) => role !== 'anonymous' && role !== 'authenticated',
  );

  if (client.userRoles.length === 0) {
    const err = new HttpException(
      'no custom userRole specified',
      HttpStatus.BAD_REQUEST,
    );
    Logger.error(err);
    throw err;
  }

  if (client.userRoles.length > 1) {
    const err = new HttpException(
      'too many custom roles specified',
      HttpStatus.BAD_REQUEST,
    );
    Logger.error(err);
    throw err;
  }

  return client;
};
