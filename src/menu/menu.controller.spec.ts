import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PostgresService } from '../postgres/postgres.service';
import { createApp, encodeUser, mockUserId } from '../test';
import { UserRoles } from '../auth/model';
import { CreateMenuDto } from './dto/create-menu.dto';

describe('MenuController (e2e, positive)', () => {
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

  it('GET /menu', async () => {
    const menuItem1 = await postgres.menu.create({
      include: { category: true },
      data: {
        name: 'cheseburgor',
        description: 'very yummy!',
        ingredients: 'borgar,cheese',
        photoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
        category: { create: { categoryName: 'borgars' } },
      },
    });

    await postgres.menu.create({
      data: {
        name: 'hamburgor',
        description: 'yum yum',
        ingredients: 'monka,yyyyy,mleko',
        photoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
        categoryId: menuItem1.categoryId,
      },
    });

    return request(app.getHttpServer())
      .get('/menu')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          itemsAvailable: expect.any(Number),
          menuItems: expect.arrayContaining([
            {
              itemId: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              name: expect.any(String),
              photoUrl: expect.any(String),
              description: expect.any(String),
              ingredients: expect.any(String),
              available: true,
              categoryId: expect.any(Number),
              category: expect.any(Object),
            },
          ]),
        });
      });
  });

  it('POST /menu', () => {
    const boss = encodeUser({
      userDetails: 'boss user',
      userId: 'abc2bj3vbp7ag9e2e2ekci0a5cmg17jd',
      userRoles: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED, UserRoles.BOSS],
    });

    const newMenuItem: CreateMenuDto = {
      name: 'hamburgor',
      description: 'yum yum',
      ingredients: 'monka,yyyyy,mleko',
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
      category: { connect: { categoryId: 1 } },
    };

    return request(app.getHttpServer())
      .post('/menu')
      .set({ 'x-ms-client-principal': boss })
      .send(newMenuItem)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          menuItem: {
            itemId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: 'hamburgor',
            photoUrl:
              'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
            description: 'yum yum',
            ingredients: 'monka,yyyyy,mleko',
            available: true,
            categoryId: 1,
          },
        });
      });
  });

  it('GET /menu/id', () => {
    return request(app.getHttpServer())
      .get('/menu/1')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          menuItem: {
            itemId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: expect.any(String),
            photoUrl: expect.any(String),
            description: expect.any(String),
            ingredients: expect.any(String),
            available: true,
            categoryId: expect.any(Number),
            category: {
              categoryId: expect.any(Number),
              createdAt: expect.any(String),
              available: true,
              categoryName: expect.any(String),
            },
          },
        });
      });
  });

  it('PATCH /menu/id', async () => {
    const boss = encodeUser({
      userDetails: 'boss user',
      userId: 'abc2bj3vbp7ag9e2e2ekci0a5cmg17jd',
      userRoles: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED, UserRoles.BOSS],
    });

    const newMenuItem: CreateMenuDto = {
      name: 'mini hamburgor',
      description: 'yum yumer',
      ingredients: 'monka,yyyyy,mleko',
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
      category: { connect: { categoryId: 1 } },
    };

    const menuItem = await postgres.menu.create({ data: newMenuItem });

    return request(app.getHttpServer())
      .patch(`/menu/${menuItem.itemId}`)
      .set({ 'x-ms-client-principal': boss })
      .send({
        name: 'BIG hamburgor',
        description: 'very yummers',
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          menuItem: {
            itemId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: 'BIG hamburgor',
            photoUrl:
              'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
            description: 'very yummers',
            ingredients: 'monka,yyyyy,mleko',
            available: true,
            categoryId: 1,
          },
        });
      });
  });

  it('DELETE /menu/id', () => {
    const boss = encodeUser({
      userDetails: 'boss user',
      userId: 'abc2bj3vbp7ag9e2e2ekci0a5cmg17jd',
      userRoles: [UserRoles.ANONYMOUS, UserRoles.AUTHENTICATED, UserRoles.BOSS],
    });

    return request(app.getHttpServer())
      .delete('/menu/1')
      .set({ 'x-ms-client-principal': boss })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          menuItem: {
            itemId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: expect.any(String),
            photoUrl: expect.any(String),
            description: expect.any(String),
            ingredients: expect.any(String),
            available: false,
            categoryId: expect.any(Number),
          },
        });
      });
  });

  it('GET /menu/category/id', () => {
    return request(app.getHttpServer())
      .get('/menu/category/1')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          category: {
            categoryId: 1,
            createdAt: expect.any(String),
            available: true,
            categoryName: expect.any(String),
          },
          itemsAvailable: expect.any(Number),
          menuItems: expect.arrayContaining([
            {
              itemId: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              name: expect.any(String),
              photoUrl: expect.any(String),
              description: expect.any(String),
              ingredients: expect.any(String),
              available: true,
              categoryId: 1,
            },
          ]),
        });
      });
  });
});

describe('MenuController (e2e, negative)', () => {
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

  it('GET /menu/id - incorrect id', () => {
    return request(app.getHttpServer())
      .get('/menu/abcd')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
        });
      });
  });

  it('GET /menu/id - id not found', () => {
    return request(app.getHttpServer())
      .get('/menu/-1')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          message: 'menu item with id -1 not found',
        });
      });
  });

  it('POST /menu - no auth header provided', () => {
    const newMenuItem: CreateMenuDto = {
      name: 'hamburgor',
      description: 'yum yum',
      ingredients: 'monka,yyyyy,mleko',
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
      category: { connect: { categoryId: 1 } },
    };

    return request(app.getHttpServer())
      .post('/menu')
      .send(newMenuItem)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          message: 'x-ms-client-principal request header not provided',
        });
      });
  });

  it('POST /menu - insufficient privileges', () => {
    const manager = encodeUser({
      userDetails: 'huj',
      userId: mockUserId(),
      userRoles: [UserRoles.MANAGER],
    });

    const newMenuItem: CreateMenuDto = {
      name: 'hamburgor',
      description: 'yum yum',
      ingredients: 'monka,yyyyy,mleko',
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg',
      category: { connect: { categoryId: 1 } },
    };

    return request(app.getHttpServer())
      .post('/menu')
      .set({ 'x-ms-client-principal': manager })
      .send(newMenuItem)
      .expect(403)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
      });
  });

  it('PATCH /menu/id - incorrect id', () => {
    const boss = encodeUser({
      userDetails: 'idiota',
      userId: mockUserId(),
      userRoles: [UserRoles.BOSS],
    });

    return request(app.getHttpServer())
      .patch('/menu/abcd')
      .set({ 'x-ms-client-principal': boss })
      .send({ name: 'changed name' })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
        });
      });
  });

  it('PATCH /menu/id - id not found', () => {
    const boss = encodeUser({
      userDetails: 'idiota',
      userId: mockUserId(),
      userRoles: [UserRoles.BOSS],
    });

    return request(app.getHttpServer())
      .patch('/menu/-1')
      .set({ 'x-ms-client-principal': boss })
      .send({ name: 'changed name' })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          message: 'menu item with id -1 not found',
        });
      });
  });
});
