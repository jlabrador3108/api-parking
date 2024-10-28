import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { envs } from 'src/@config/envs';
import { JwtModule } from '@nestjs/jwt';

describe('Parking Module (e2e)', () => {
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
      .send({ email: 'empleado@parking.com', password: '1234' });

    expect(response.status).toBe(201);
    expect(response.body.data.access_token).toBeDefined();
    token = response.body.data.access_token;
  });

  it('/parking (POST) - create a new parking', async () => {
    return await request(app.getHttpServer())
      .post('/parking')
      .set('Authorization', `Bearer ${token}`)
      .send({
        denomination: 'parking' + uuidv4(),
      })
      .expect(201)
      .then((response) => {
        expect(response.body.data).toHaveProperty('id');
      });
  });

  it('/parking (GET) - get all parking', async () => {
    return await request(app.getHttpServer())
      .get('/parking')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/parking/:id (GET) - get parking by ID', async () => {
    const parking = await request(app.getHttpServer())
      .post('/parking')
      .set('Authorization', `Bearer ${token}`)
      .send({
        denomination: 'parking' + uuidv4(),
      });

    return await request(app.getHttpServer())
      .get(`/parking/${parking.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/parking/:id (PUT) - update a parking', async () => {
    const parking = await request(app.getHttpServer())
      .post('/parking')
      .set('Authorization', `Bearer ${token}`)
      .send({
        denomination: 'parking' + uuidv4(),
      });

    const denomination = 'Updated parking' + uuidv4();

    return await request(app.getHttpServer())
      .put(`/parking/${parking.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ denomination })
      .expect(200)
      .then((response) => {
        expect(response.body.data.denomination).toBe(denomination);
      });
  });

  it('/parking/:id (DELETE) - Delete parking by ID', async () => {
    const parking = await request(app.getHttpServer())
      .post('/parking')
      .set('Authorization', `Bearer ${token}`)
      .send({ denomination: 'parking' + uuidv4() })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/parking/${parking.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/parking/${parking.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
