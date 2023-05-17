import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth/auth.module';
import { ClientPrincipalDto, USER_ID_MAX_LENGTH } from '../auth/dto';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { MenuModule } from '../menu/menu.module';
import { PostgresService } from '../db/postgres/postgres.service';
import { MongoService } from '../db/mongo/mongo.service';
import { PostgresModule } from '../db/postgres/postgres.module';
import { MongoModule } from '../db/mongo/mongo.module';

type MockedApp = {
  app: INestApplication;
  postgres: PostgresService;
  mongo: MongoService;
};

export const createApp = async (): Promise<MockedApp> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      PostgresModule,
      MongoModule,
      AuthModule,
      UserModule,
      CategoryModule,
      RestaurantModule,
      MenuModule,
    ],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();

  const postgres = module.get<PostgresService>(PostgresService);
  const mongo = module.get<MongoService>(MongoService);

  return {
    app,
    postgres,
    mongo,
  };
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
