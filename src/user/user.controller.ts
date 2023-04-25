import { Controller, Get, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AboutUserResponse } from './responses/about-user.response';
import {
  ClientPrincipalDto,
  SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO,
} from '../auth/dto';
import { CLIENT_PRINCIPAL_HEADER, ClientPrincipal } from '../auth/decorator';
import { RequestErrorResponse } from '../app/response';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'return all information about a user' })
  @ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
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
  @Get('me')
  async fetchUser(
    @ClientPrincipal() user: ClientPrincipalDto,
  ): Promise<AboutUserResponse> {
    Logger.log(`/user/me, userId = ${user.userId}`);
    return this.userService.fetchUser(user);
  }
}
