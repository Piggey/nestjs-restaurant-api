import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from '../user/dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
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
  async signIn(@Body() usr: UserAuthDto): Promise<UserSignInResponse> {
    return this.authService.signIn(usr);
  }
}
