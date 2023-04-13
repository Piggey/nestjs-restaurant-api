import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientPrincipalDto } from '../user/dto';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserSignInResponse } from '../user/response';
import { ClientPrincipal } from '../user/decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  @ApiHeader({
    name: 'x-ms-client-principal',
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
  async signIn(
    @ClientPrincipal() usr: ClientPrincipalDto,
  ): Promise<UserSignInResponse> {
    return this.authService.signIn(usr);
  }
}
