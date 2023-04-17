import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CLIENT_PRINCIPAL_HEADER, ClientPrincipal } from './decorator';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AboutUserResponse } from './response';

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
      'returns user data. also returns employee data if this user is also an employee',
    type: AboutUserResponse,
  })
  @ApiBadRequestResponse({
    description: `${CLIENT_PRINCIPAL_HEADER} was not provided`,
  })
  @ApiNotFoundResponse()
  @Get('me')
  async me(@ClientPrincipal() user): Promise<AboutUserResponse> {
    return this.userService.me(user);
  }
}
