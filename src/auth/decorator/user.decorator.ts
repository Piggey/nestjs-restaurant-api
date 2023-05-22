import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

export const UserDecorator = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<User> => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req['user'];
  },
);
