import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessTokenDto } from '../dto';

export const JwtPayload = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtAccessTokenDto => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(req);
    Logger.log(`${req.method} ${req.url}, parsing JWT Bearer token`);

    return decodeJwtPayload(token);
  },
);

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers['authorization']?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export function decodeJwtPayload(token: string): JwtAccessTokenDto {
  try {
    const payload = new JwtService().verify(token, {
      secret: new ConfigService().get('JWT_SECRET'),
    });
    return payload;
  } catch {
    Logger.error('could not parse JWT token');
    throw new BadRequestException('could not parse JWT token');
  }
}
