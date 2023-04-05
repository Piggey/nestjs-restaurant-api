import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserAuthDto } from '../user/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  signIn(usr: UserAuthDto) {
    throw new Error('Method not implemented.');
  }
  signUp(usr: UserAuthDto) {
    throw new Error('Method not implemented.');
  }
}
