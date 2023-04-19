import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CLIENT_PRINCIPAL_HEADER, ClientPrincipal } from './decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AboutUserResponse,
  CreateEmployeeResponse,
  FetchEmployeesResponse,
} from './response';
import { RequestErrorResponse } from '../app/response';
import { RolesGuard } from '../auth/guard';
import { AllowRoles } from '../auth/decorator';
import { UserRoles } from './model';
import { CreateEmployeeDto, UserAuthDto } from './dto';

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
  @ApiOkResponse({
    description:
      'returns all hired employees in his restaurant for a `MANAGER` level role, returns all hired employees for `BOSS` level role',
    type: FetchEmployeesResponse,
  })
  @ApiBadRequestResponse({
    description: 'something went wrong with provided user data',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: '`userRole` level is not high enough',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowRoles(UserRoles.MANAGER)
  @Get('employees')
  async fetchEmployees(
    @ClientPrincipal() user,
  ): Promise<FetchEmployeesResponse> {
    return this.userService.fetchEmployees(user);
  }

  @ApiHeader(clientHeaderInfo)
  @ApiCreatedResponse({
    description: 'created a new employee and him to a restaurant',
    type: CreateEmployeeResponse,
  })
  @ApiForbiddenResponse({
    description: '`userRole` level was not high enough',
    type: RequestErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'either `User` or `Restaurant` was not found in the database',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: 424,
    description:
      'something went wrong while adding a new employee to the database',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowRoles(UserRoles.MANAGER)
  @Post('employees')
  async createEmployee(
    @ClientPrincipal() user: UserAuthDto,
    @Body() employee: CreateEmployeeDto,
  ): Promise<CreateEmployeeResponse> {
    return this.userService.createEmployee(user, employee);
  }
}
