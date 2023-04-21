import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ClientPrincipalDto, USER_ID_MAX_LENGTH } from '../auth/dto';
import { UserModule } from '../user/user.module';

export const createApp = async (): Promise<INestApplication> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, UserModule],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  return app.init();
};

export const encodeUser = (user: ClientPrincipalDto): string => {
  return Buffer.from(JSON.stringify(user)).toString('base64');
};

export const mockUserId = (): string => {
  const CHARS = 'abcdefghijklmnoprstuwvxyz0123456789';

  let result = '';
  for (let i = 0; i < USER_ID_MAX_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  return result;
};

export const randomNumberString = (): string => {
  return Math.trunc(Math.random() * 69420).toString();
};
