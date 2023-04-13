import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as request from 'supertest';
import { ClientPrincipalDto, UserRoles } from '../user/dto';

describe('AuthController (e2e, positive)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign a new user in, with adding new user to db', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .set({
        'x-ms-client-principal': encodeUser({
          userId: mockUserId(),
          userDetails: `testUser${randomNumberString()}`,
          userRoles: [
            UserRoles.ANONYMOUS,
            UserRoles.AUTHENTICATED,
            UserRoles.CLIENT,
          ],
        }),
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          userSignedIn: true,
          userCreated: true,
          userUpdated: true,
        });
      });
  });

  it('should sign a user in, without adding new user to db', async () => {
    const userId = mockUserId();
    const userDetails = `testUser${randomNumberString()}`;
    const userRoles = [
      UserRoles.ANONYMOUS,
      UserRoles.AUTHENTICATED,
      UserRoles.CLIENT,
    ];

    await request(app.getHttpServer())
      .post('/auth/signin')
      .set({
        'x-ms-client-principal': encodeUser({
          userId,
          userDetails,
          userRoles,
        }),
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          userSignedIn: true,
          userCreated: true,
          userUpdated: true,
        });
      });

    return request(app.getHttpServer())
      .post('/auth/signin')
      .set({
        'x-ms-client-principal': encodeUser({
          userId,
          userDetails,
          userRoles,
        }),
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          userSignedIn: true,
          userCreated: false,
          userUpdated: false,
        });
      });
  });

  it('should sign a user in and update db with new information', async () => {
    const userId = mockUserId();
    const userDetails = `testUser${randomNumberString()}`;

    // sign in a user with role CLIENT
    await request(app.getHttpServer())
      .post('/auth/signin')
      .set({
        'x-ms-client-principal': encodeUser({
          userId,
          userDetails,
          userRoles: [
            UserRoles.ANONYMOUS,
            UserRoles.AUTHENTICATED,
            UserRoles.CLIENT,
          ],
        }),
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          userSignedIn: true,
          userCreated: true,
          userUpdated: true,
        });
      });

    // update role to MANAGER
    return request(app.getHttpServer())
      .post('/auth/signin')
      .set({
        'x-ms-client-principal': encodeUser({
          userId,
          userDetails,
          userRoles: [
            UserRoles.ANONYMOUS,
            UserRoles.AUTHENTICATED,
            UserRoles.MANAGER,
          ],
        }),
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          userSignedIn: true,
          userCreated: false,
          userUpdated: true,
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

  it('should throw error 400 when no x-ms-client-principal header is provided', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          message: 'x-ms-client-principal request header not found',
        });
      });
  });

  it('should throw error 400 when no custom role is specified', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .set({
        'x-ms-client-principal': encodeUser({
          userId: mockUserId(),
          userDetails: `testUser${randomNumberString()}`,
          userRoles: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED],
        }),
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          message: 'no custom userRole specified',
        });
      });
  });

  it('should throw error 400 when too many roles are specified', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .set({
        'x-ms-client-principal': encodeUser({
          userId: mockUserId(),
          userDetails: `testUser${randomNumberString()}`,
          userRoles: [
            UserRoles.ANONYMOUS,
            UserRoles.AUTHENTICATED,
            UserRoles.CLIENT,
            UserRoles.DELIVERY,
          ],
        }),
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          message: 'too many custom roles specified',
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

const encodeUser = (user: ClientPrincipalDto): string => {
  return Buffer.from(JSON.stringify(user)).toString('base64');
};

const mockUserId = (): string => {
  const CHARS = 'abcdefghijklmnoprstuwvxyz0123456789';
  const RESULT_LENGTH = 32;

  let result = '';
  for (let i = 0; i < RESULT_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  return result;
};

const randomNumberString = (): string => {
  return Math.trunc(Math.random() * 69420).toString();
};
