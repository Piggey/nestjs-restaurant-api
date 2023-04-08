import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserSignInResponse, UserSignUpResponse } from 'src/user/response';
import { PrismaService } from '../prisma/prisma.service';
import { UserAuthDto } from '../user/dto';
import { User } from '@prisma/client';
import { JwtPayload } from './jwt';

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
          passwordHash: usr.passwordHash,
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

  async signIn(usr: UserAuthDto): Promise<UserSignInResponse> {
    // try to get user from the database
    const dbUser: User = await this.db.user.findFirst({
      where: {
        email: usr.email,
      },
    });

    // incorrect credentials
    if (!dbUser || dbUser.passwordHash !== usr.passwordHash) {
      throw new HttpException(
        'invalid email or password',
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      access_token: this.generateJwtToken(dbUser),
    };
  }

  private generateJwtToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    return this.jwt.sign(payload, {
      secret: this.config.getOrThrow('JWT_SECRET'),
      expiresIn: this.config.getOrThrow('JWT_EXPIRE_DATE'),
    });
  }
}
