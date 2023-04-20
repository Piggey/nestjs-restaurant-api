import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { AllowRoles, ClientPrincipal } from './decorator';
import { RolesGuard } from './guard';
import { UserRoles } from './model';
import {
  ClientPrincipalDto,
  SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO,
} from './dto';
import { UserSignInResponse } from './responses';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
  @ApiCreatedResponse({
    description:
      'successfully signed a user in. returns `true` if new used had to be created in the database, otherwise returns `false`',
    type: UserSignInResponse,
  })
  @ApiBadRequestResponse({
    description:
      "request's body was incorrect. more info in response's `message` attribute",
  })
  @Post('signin')
  async signIn(
    @ClientPrincipal() usr: ClientPrincipalDto,
  ): Promise<UserSignInResponse> {
    return this.authService.signIn(usr);
  }

  @Get('test')
  @UseGuards(RolesGuard)
  @AllowRoles(UserRoles.MANAGER)
  async test() {
    return true;
  }
}
