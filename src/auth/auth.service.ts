import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserSignUpResponse } from 'src/user/response';
import { PrismaService } from '../prisma/prisma.service';
import { UserAuthDto } from '../user/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(usr: UserAuthDto): Promise<UserSignUpResponse> {
    try {
      const user = await this.db.user.create({
        data: {
          email: usr.email,
          password_hash: usr.passwordHash,
          role_id: 1, // TODO: make an enum of all roles
        },
      });
      return { userCreated: !!user };
    } catch (err) {
      if (err.code === 'P2002') {
        throw new HttpException(
          'provided email is not unique',
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  signIn(usr: UserAuthDto) {
    throw new Error('Method not implemented.');
  }
}
