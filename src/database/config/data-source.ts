import { DataSource } from 'typeorm';
import { envs } from '../../@config/envs';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.postgres_host,
  port: envs.postgres_port,
  username: envs.postgres_user,
  password: envs.postgres_pass,
  database: envs.postgres_db,
  entities: [__dirname + '/../../**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  synchronize: false,
});
