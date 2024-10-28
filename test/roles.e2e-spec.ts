import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { envs } from 'src/@config/envs';
import { JwtModule } from '@nestjs/jwt';

describe('Roles Module (e2e)', () => {
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

  it('should authenticate and return a valid JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'admin@parking.com', password: '1234' });

    expect(response.status).toBe(201);
    expect(response.body.data.access_token).toBeDefined();
    token = response.body.data.access_token;
  });

  it('/roles (POST) - create a new role', async () => {
    return await request(app.getHttpServer())
      .post('/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        denomination: 'role' + uuidv4(),
      })
      .expect(201)
      .then((response) => {
        expect(response.body.data).toHaveProperty('id');
      });
  });

  it('/roles (GET) - get all role', async () => {
    return await request(app.getHttpServer())
      .get('/roles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/roles/:id (GET) - get role by ID', async () => {
    const role = await request(app.getHttpServer())
      .post('/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        denomination: 'role' + uuidv4(),
      });

    return await request(app.getHttpServer())
      .get(`/roles/${role.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/roles/:id (PUT) - update a role', async () => {
    const role = await request(app.getHttpServer())
      .post('/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        denomination: 'role' + uuidv4(),
      });

    const denomination = 'Updated role' + uuidv4();

    return await request(app.getHttpServer())
      .put(`/roles/${role.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ denomination })
      .expect(200)
      .then((response) => {
        expect(response.body.data.denomination).toBe(denomination);
      });
  });

  it('/roles/:id (DELETE) - Delete role by ID', async () => {
    const role = await request(app.getHttpServer())
      .post('/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({ denomination: 'role' + uuidv4() })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/roles/${role.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/roles/${role.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
