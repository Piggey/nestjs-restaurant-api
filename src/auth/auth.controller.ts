import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from '../user/dto';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserSignInResponse } from '../user/response';
import { CLIENT_PRINCIPAL_HEADER, ClientPrincipal } from '../user/decorator';
import { AllowRoles } from './decorator';
import { RolesGuard } from './guard';
import { UserRoles } from '../user/model';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiHeader({
    name: CLIENT_PRINCIPAL_HEADER,
    description: 'Client principal encoded as base64',
    example: 'eyJ1c2VySWQiOiAiMjIyMjIyMjIyMiJ9',
    required: true,
  })
  @ApiOkResponse({
    description:
      'successfully signed a user in. returns `true` if new used had to be created in the database, otherwise returns `false`',
    type: UserSignInResponse,
  })
  @ApiBadRequestResponse({
    description:
      "request's body was incorrect. more info in response's `message` attribute",
  })
  @Post('signin')
  @HttpCode(200)
  async signIn(
    @ClientPrincipal() usr: UserAuthDto,
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
