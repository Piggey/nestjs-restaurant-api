import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserRoles } from '../user/model';
import { createApp, encodeUser, mockUserId, randomNumberString } from '../test';

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
          message: 'x-ms-client-principal request header not provided',
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
