import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleLevel, UserRoles } from '../model';
import { PostgresService } from '../../db/postgres/postgres.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessTokenDto } from '../dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly db: PostgresService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const requiredRole = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    )[0];

    this.logger.log(
      `Authorizing ${req.method} ${req.url} | required role: ${requiredRole}`,
    );

    const token = this.extractTokenFromHeader(req);
    this.logger.log('authorization token found');
    if (!token) {
      this.logger.error('Authorization failed: token not provided');
      throw new UnauthorizedException();
    }

    const payload = await this.decodeJwtPayload(token);
    this.logger.log('authorization payload decoded');
    const user = await this.getUserFromPayload(payload);
    if (!user) {
      this.logger.error('Authorization failed: could not find user');
      throw new NotFoundException();
    }

    req['payload'] = payload;
    req['user'] = user;
    return this.validateClientRoles(user.userRole as UserRoles, requiredRole);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async decodeJwtPayload(token: string): Promise<JwtAccessTokenDto> {
    try {
      const payload = this.jwt.decode(token) as JwtAccessTokenDto;
      // const payload = this.jwt.verifyAsync(token, {
      //   secret: this.config.get('JWT_SECRET'),
      // });
      return payload;
    } catch {
      Logger.error('could not parse JWT token');
      throw new BadRequestException('could not parse JWT token');
    }
  }

  private async getUserFromPayload(
    payload: JwtAccessTokenDto,
  ): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: { userEmail: payload.email },
    });

    return user;
  }

  private validateClientRoles(
    clientRole: UserRoles,
    minRole: UserRoles,
  ): boolean {
    return UserRoleLevel[clientRole] >= UserRoleLevel[minRole];
  }
}
