import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
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
import {
  AllowMinRole,
  CLIENT_PRINCIPAL_HEADER,
  ClientPrincipal,
} from '../auth/decorator';
import { RequestErrorResponse } from '../app/response';
import { RolesGuard } from '../auth/guard';
import { UserRoles } from '../auth/model';

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
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.CLIENT)
  @Get('me')
  async fetchUser(): // @ClientPrincipal() user: ClientPrincipalDto,
  Promise<any> {
    return true;
    // Logger.log(`/user/me, userId = ${user.userId}`);
    // return this.userService.fetchUser(user);
  }
}
