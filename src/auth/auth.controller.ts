import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from 'src/user/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() usr: UserAuthDto) {
    return this.authService.signUp(usr);
  }

  @Post('signin')
  async signIn(@Body() usr: UserAuthDto) {
    return this.authService.signIn(usr);
  }
}
