import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CLIENT_PRINCIPAL_HEADER, ClientPrincipal } from './decorator';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AboutUserResponse, FetchEmployeesResponse } from './response';
import { RequestErrorResponse } from '../app/response';
import { RolesGuard } from 'src/auth/guard';
import { AllowRoles } from 'src/auth/decorator';
import { UserRoles } from './model';

const clientHeaderInfo = {
  name: CLIENT_PRINCIPAL_HEADER,
  description: 'Client principal encoded as base64',
  example: 'eyJ1c2VySWQiOiAiMjIyMjIyMjIyMiJ9',
  required: true,
};

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiHeader(clientHeaderInfo)
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
  async me(@ClientPrincipal() user): Promise<AboutUserResponse> {
    return this.userService.me(user);
  }

  @ApiHeader(clientHeaderInfo)
  @UseGuards(RolesGuard)
  @AllowRoles(UserRoles.MANAGER)
  @Get('employees')
  async fetchEmployees(
    @ClientPrincipal() user,
  ): Promise<FetchEmployeesResponse> {
    return this.userService.fetchEmployees(user);
  }
}
