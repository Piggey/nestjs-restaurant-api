import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AllowMinRole } from './decorator';
import { RolesGuard } from './guard';
import { UserRoles } from './model';
import { SignInDto } from './dto';
import { UserSignInResponse } from './responses';
import { RequestErrorResponse } from '../app/response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'sign a new user to our database' })
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
  async signIn(@Body() dto: SignInDto): Promise<UserSignInResponse> {
    Logger.log(`/auth/signin, ${dto.email}`);
    return this.authService.signIn(dto);
  }

  @Get('test')
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.MANAGER)
  async test() {
    Logger.log('why would you even call that');
    return true;
  }
}
