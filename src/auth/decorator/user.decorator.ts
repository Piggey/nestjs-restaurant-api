import {
  ExecutionContext,
  Logger,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from '../../postgres/postgres.service';
import { User } from '../../user/entities/user.entity';
import {
  decodeJwtPayload,
  extractTokenFromHeader,
} from './jwt-payload.decorator';

export const UserDecorator = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<User> => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(req);
    Logger.log(`${req.method} ${req.url}, parsing JWT Bearer token`);

    return await getUserFromToken(token);
  },
);

export async function getUserFromToken(token: string): Promise<User> {
  const config = new ConfigService();
  const db = new PostgresService(config);
  const payload = decodeJwtPayload(token);

  try {
    const user = await db.user.findFirstOrThrow({
      where: { userEmail: payload.email },
    });
    return user;
  } catch {
    Logger.error('JWT parser: user does not exist in the database');
    throw new NotFoundException(
      `JWT parser: user ${payload.email} does not exist`,
    );
  }
}
