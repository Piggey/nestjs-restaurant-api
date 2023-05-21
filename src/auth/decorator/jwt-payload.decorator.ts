import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtAccessTokenDto } from '../dto';

export const JwtPayload = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtAccessTokenDto => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req['payload'];
  },
);
