import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CLIENT_PRINCIPAL_HEADER, ClientPrincipal } from './decorator';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientDataResponse, EmployeeDataResponse } from './response';
import { RequestErrorResponse } from '../app/response';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiHeader({
    name: CLIENT_PRINCIPAL_HEADER,
    description: 'Client principal encoded as base64',
    example: 'eyJ1c2VySWQiOiAiMjIyMjIyMjIyMiJ9',
    required: true,
  })
  @ApiOkResponse({
    description:
      'returns client data. also returns employee data if this user is also an employee',
    type: EmployeeDataResponse,
  })
  @ApiBadRequestResponse({
    description: `${CLIENT_PRINCIPAL_HEADER} was not provided`,
    type: RequestErrorResponse,
  })
  @Get('me')
  me(@ClientPrincipal() client): ClientDataResponse | EmployeeDataResponse {
    return this.userService.me(client);
  }
}
