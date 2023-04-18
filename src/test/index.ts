import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { UserAuthDto } from '../user/dto';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

export const createApp = async (): Promise<INestApplication> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      JwtModule.register({}),
      ConfigModule.forRoot(),
      PrismaModule,
      AuthModule,
      UserModule,
    ],
    // controllers: [AuthController, UserController],
    // providers: [AuthService, UserService],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  return app.init();
};

export const encodeUser = (user: UserAuthDto): string => {
  return Buffer.from(JSON.stringify(user)).toString('base64');
};

export const mockUserId = (): string => {
  const CHARS = 'abcdefghijklmnoprstuwvxyz0123456789';
  const RESULT_LENGTH = 32;

  let result = '';
  for (let i = 0; i < RESULT_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  return result;
};

export const randomNumberString = (): string => {
  return Math.trunc(Math.random() * 69420).toString();
};
