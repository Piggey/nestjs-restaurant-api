import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as request from 'supertest';
import { UserAuthDto } from '../user/dto';

describe('AuthController (e2e, positive)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockNewUser())
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          userCreated: expect.any(Boolean),
        });
      });
  });
});

describe('AuthController (e2e, negative)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should throw error 409 when email is not unique', async () => {
    const user = mockNewUser();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201);

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(409)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 409,
          message: 'provided email is not unique',
        });
      });
  });

  it('should throw error 400 when arguments are incorrect', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'not even an email',
        passwordHash: 'secure!',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: expect.arrayContaining([
            'email must be an email',
            "passwordHash's byte length must fall into (64, 64) range",
          ]),
        });
      });
  });

  it('should throw error 400 when no arguments are passed in', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: expect.arrayContaining([
            'email must be an email',
            "passwordHash's byte length must fall into (64, 64) range",
            'passwordHash must be a string',
          ]),
        });
      });
  });
});

const createApp = async (): Promise<INestApplication> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [JwtModule.register({}), ConfigModule.forRoot(), PrismaModule],
    controllers: [AuthController],
    providers: [AuthService],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  return app.init();
};

const mockNewUser = (): UserAuthDto => {
  return {
    email: `testUser${randomNumberString()}@test.com`,
    passwordHash:
      'd04b98f48e8f8bcc15c6ae5ac050801cd6dcfd428fb5f9e65c4e16e7807340fa',
  };
};

const randomNumberString = (): string => {
  return Math.trunc(Math.random() * 69420).toString();
};
