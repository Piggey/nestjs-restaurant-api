import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AboutUserResponse } from './responses/about-user.response';
import { JWT_ACCESS_TOKEN_HEADER, JwtAccessTokenDto } from '../auth/dto';
import {
  AllowMinRole,
  CLIENT_PRINCIPAL_HEADER,
  JwtPayload,
} from '../auth/decorator';
import { RequestErrorResponse } from '../app/response';
import { RolesGuard } from '../auth/guard';
import { UserRoles } from '../auth/model';

@ApiHeader(JWT_ACCESS_TOKEN_HEADER)
@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'return all information about a user' })
  @ApiOkResponse({
    description:
      'returns user data. also returns employee data if this user is also an employee',
    type: AboutUserResponse,
  })
  @ApiBadRequestResponse({
    description: `${CLIENT_PRINCIPAL_HEADER} was not provided`,
    type: RequestErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'user with given `userId` not found in the database',
    type: RequestErrorResponse,
  })
  @AllowMinRole(UserRoles.CLIENT)
  @Get('me')
  async aboutMe(
    @JwtPayload() payload: JwtAccessTokenDto,
  ): Promise<AboutUserResponse> {
    this.logger.log(`/auth/me - ${payload.email}`);
    return this.userService.aboutMe(payload);
  }
}
