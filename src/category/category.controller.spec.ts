import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from '../test';
import { PostgresService } from '../postgres/postgres.service';
import { encodeUser } from '../test';
import { UserRoles } from '../auth/model';
import { mockUserId } from '../test';

describe('CategoryController (e2e, positive)', () => {
  let app: INestApplication;
  let postgres: PostgresService;

  beforeAll(async () => {
    const { app: _app, postgres: _postgres } = await createApp();
    app = _app;
    postgres = _postgres;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /category', async () => {
    // mock some categories
    await postgres.category.create({ data: { categoryName: 'category1' } });
    await postgres.category.create({ data: { categoryName: 'category2' } });

    return request(app.getHttpServer())
      .get('/category')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          numCategories: expect.any(Number),
          categories: expect.arrayContaining([
            {
              categoryId: expect.any(Number),
              createdAt: expect.any(String),
              available: true,
              categoryName: expect.any(String),
            },
          ]),
        });
      });
  });

  it('PATCH /category/id', async () => {
    const boss = encodeUser({
      userDetails: 'boss user',
      userId: 'abc2bj3vbp7ag9e2e2ekci0a5cmg17jd',
      userRoles: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED, UserRoles.BOSS],
    });

    const category = await postgres.category.create({
      data: { categoryName: 'bad category' },
    });

    return request(app.getHttpServer())
      .patch(`/category/${category.categoryId}`)
      .set({ 'x-ms-client-principal': boss })
      .send({ categoryName: 'better category' })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          category: {
            categoryId: category.categoryId,
            createdAt: expect.any(String),
            available: category.available,
            categoryName: 'better category',
          },
        });
      });
  });

  it('DELETE /category/id', async () => {
    const boss = encodeUser({
      userDetails: 'boss user',
      userId: 'abc2bj3vbp7ag9e2e2ekci0a5cmg17jd',
      userRoles: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED, UserRoles.BOSS],
    });

    const category = await postgres.category.create({
      data: { categoryName: 'borgar' },
    });
    await postgres.menu.create({
      data: {
        name: 'cheseburgor',
        description: 'very yummy!',
        ingredients: 'borgar,cheese',
        photoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
        category: { connect: { categoryId: category.categoryId } },
      },
    });

    return request(app.getHttpServer())
      .delete(`/category/${category.categoryId}`)
      .set({ 'x-ms-client-principal': boss })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          menuItemsDeleted: 1,
          category: {
            categoryId: expect.any(Number),
            createdAt: expect.any(String),
            available: false,
            categoryName: 'borgar',
          },
        });
      });
  });
});

describe('CategoryController (e2e, negative)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let postgres: PostgresService;

  beforeAll(async () => {
    const { app: _app, postgres: _postgres } = await createApp();
    app = _app;
    postgres = _postgres;
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /category/id - no auth header provided', () => {
    return request(app.getHttpServer())
      .patch('/category/1')
      .send({ categoryName: 'twoja stara' })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          message: 'x-ms-client-principal request header not provided',
        });
      });
  });

  it('PATCH /category/id - insufficient privileges', () => {
    const manager = encodeUser({
      userDetails: 'huj',
      userId: mockUserId(),
      userRoles: [UserRoles.MANAGER],
    });

    return request(app.getHttpServer())
      .patch('/category/1')
      .set({ 'x-ms-client-principal': manager })
      .send({ categoryName: 'twoja stara' })
      .expect(403)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
      });
  });

  it('PATCH /category/id - incorrect id', () => {
    const boss = encodeUser({
      userDetails: 'boss user',
      userId: 'abc2bj3vbp7ag9e2e2ekci0a5cmg17jd',
      userRoles: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED, UserRoles.BOSS],
    });

    return request(app.getHttpServer())
      .patch('/category/abcd')
      .set({ 'x-ms-client-principal': boss })
      .send({ categoryName: 'twoja stara' })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
        });
      });
  });

  it('PATCH /category/id - id not found', () => {
    const boss = encodeUser({
      userDetails: 'boss user',
      userId: 'abc2bj3vbp7ag9e2e2ekci0a5cmg17jd',
      userRoles: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED, UserRoles.BOSS],
    });

    return request(app.getHttpServer())
      .patch('/category/-1')
      .set({ 'x-ms-client-principal': boss })
      .send({ categoryName: 'twoja stara' })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          message: 'category with id -1 not found',
        });
      });
  });
});
