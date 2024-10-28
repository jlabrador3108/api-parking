import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { envs } from 'src/@config/envs';
import { JwtModule } from '@nestjs/jwt';

describe('Parking Logs Module (e2e)', () => {
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

  it('/parking-logs (GET) - get all parking logs', async () => {
    return await request(app.getHttpServer())
      .get('/parking-logs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });
});
