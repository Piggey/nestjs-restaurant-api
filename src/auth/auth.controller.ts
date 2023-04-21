import { Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AllowRoles,
  CLIENT_PRINCIPAL_HEADER,
  ClientPrincipal,
} from './decorator';
import { RolesGuard } from './guard';
import { UserRoles } from './model';
import {
  ClientPrincipalDto,
  SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO,
} from './dto';
import { UserSignInResponse } from './responses';
import { RequestErrorResponse } from 'src/app/response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'sign a new user to our database' })
  @ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
  @ApiCreatedResponse({
    description:
      'successfully signed a user in. returns `true` if new used had to be created in the database, otherwise returns `false`',
    type: UserSignInResponse,
  })
  @ApiBadRequestResponse({
    description:
      "request's body was incorrect. more info in response's `message` attribute",
    type: RequestErrorResponse,
  })
  @Post('signin')
  async signIn(
    @ClientPrincipal() user: ClientPrincipalDto,
  ): Promise<UserSignInResponse> {
    Logger.log(`/auth/signin, userId = ${user.userId}`);
    return this.authService.signIn(user);
  }

  @ApiCookieAuth(CLIENT_PRINCIPAL_HEADER)
  @Get('test')
  @UseGuards(RolesGuard)
  @AllowRoles(UserRoles.MANAGER)
  async test() {
    Logger.log('why would you even call that');
    return true;
  }
}
