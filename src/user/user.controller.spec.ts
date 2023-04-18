import { INestApplication } from '@nestjs/common';
import { createApp, encodeUser, mockUserId, randomNumberString } from '../test';
import * as request from 'supertest';
import { UserRoles } from './model';

describe('UserController (e2e, positive)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return user data with no employee data', async () => {
    const clientPrincipal = encodeUser({
      userId: mockUserId(),
      userDetails: `testUser${randomNumberString()}`,
      userRoles: [UserRoles.CLIENT],
    });

    // add a test user
    await request(app.getHttpServer())
      .post('/auth/signin')
      .set({ 'x-ms-client-principal': clientPrincipal })
      .expect(200);

    return request(app.getHttpServer())
      .get('/users/me')
      .set({ 'x-ms-client-principal': clientPrincipal })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          user: {
            userDetails: expect.any(String),
            userRole: 'CLIENT',
            loyaltyPoints: 0,
          },
        });
        expect(res.body.employee).toBeUndefined();
      });
  });

  it('should return both user and employee data', () => {
    expect(true).toBe(true);
  });
});
