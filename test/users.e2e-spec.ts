import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { envs } from 'src/@config/envs';
import { JwtModule } from '@nestjs/jwt';

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({
          secret: envs.secret_key,
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - create a new user', async () => {
    return await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test@example.' + uuidv4(),
        password: '1234',
      })
      .expect(201)
      .then((response) => {
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe('Test User');
      });
  });

  it('should authenticate and return a valid JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'admin@parking.com', password: '1234' });

    expect(response.status).toBe(201);
    expect(response.body.data.access_token).toBeDefined();
    token = response.body.data.access_token;
  });

  it('/users (GET) - get all users', async () => {
    return await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/users/:id (GET) - get user by ID', async () => {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test2@example.' + uuidv4(),
        password: '1234',
      });

    return await request(app.getHttpServer())
      .get(`/users/${user.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.data.name).toBe('Test User');
      });
  });

  it('/users/:id (PUT) - update a user', async () => {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test3@example.' + uuidv4(),
        password: '1234',
      });

    return await request(app.getHttpServer())
      .put(`/users/${user.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User' })
      .expect(200)
      .then((response) => {
        expect(response.body.data.name).toBe('Updated User');
      });
  });
});
