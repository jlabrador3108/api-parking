import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { envs } from 'src/@config/envs';
import { JwtModule } from '@nestjs/jwt';

describe('Reservations Module (e2e)', () => {
  let app: INestApplication;
  let clientToken: string;
  let employeeToken: string;
  const cantDays = 30;

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

  it('should client authenticate and return a valid JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'cliente@parking.com', password: '1234' });

    expect(response.status).toBe(201);
    expect(response.body.data.access_token).toBeDefined();
    clientToken = response.body.data.access_token;
  });

  it('should employee authenticate and return a valid JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'empleado@parking.com', password: '1234' });

    expect(response.status).toBe(201);
    expect(response.body.data.access_token).toBeDefined();
    employeeToken = response.body.data.access_token;
  });

  it('/reservations (POST) - create a new reservations', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + cantDays);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + cantDays + 1);

    return await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        carPlate: 'TABC123',
        startDate,
        endDate,
      })
      .expect(201)
      .then((response) => {
        expect(response.body.data).toHaveProperty('id');
      });
  });

  it('/reservations (GET) - get all reservations', async () => {
    return await request(app.getHttpServer())
      .get('/reservations')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/reservations/:id (GET) - get reservation by ID', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + cantDays + 2);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + cantDays + 3);
    const reservation = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        carPlate: 'TABC123',
        startDate,
        endDate,
      });

    return await request(app.getHttpServer())
      .get(`/reservations/${reservation.body.data.id}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);
  });

  it('/reservations/:id (PUT) - update a reservation', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + cantDays + 4);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + cantDays + 5);
    const reservation = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        carPlate: 'TABC123',
        startDate,
        endDate,
      });

    return await request(app.getHttpServer())
      .put(`/reservations/${reservation.body.data.id}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ cardPlate: 'updated card plate' })
      .expect(200)
      .then((response) => {
        expect(response.body.data.cardPlate).toBe('updated card plate');
      });
  });

  it('/reservations/:id (DELETE) - Delete reservation by ID', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + cantDays + 6);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + cantDays + 7);
    const reservation = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        carPlate: 'TABC123',
        startDate,
        endDate,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/reservations/${reservation.body.data.id}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/reservations/${reservation.body.data.id}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(404);
  });
});
