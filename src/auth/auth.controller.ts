import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from '../user/dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserSignInResponse, UserSignUpResponse } from '../user/response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'successfully created user and added them to the database.',
    type: UserSignUpResponse,
  })
  @ApiBadRequestResponse({
    description:
      "request's body was incorrect. more info in response's `message` attribute",
  })
  @ApiConflictResponse({
    description: 'provided email is not unique',
  })
  async signUp(@Body() usr: UserAuthDto): Promise<UserSignUpResponse> {
    return this.authService.signUp(usr);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'successfully signed a user in. returns a JWT token',
    type: UserSignInResponse,
  })
  @ApiBadRequestResponse({
    description:
      "request's body was incorrect. more info in response's `message` attribute",
  })
  @ApiForbiddenResponse({
    description: 'provided credentials were incorrect. returns an error',
  })
  async signIn(@Body() usr: UserAuthDto): Promise<UserSignInResponse> {
    return this.authService.signIn(usr);
  }
}
