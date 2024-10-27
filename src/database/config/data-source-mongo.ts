import { envs } from 'src/@config/envs';
import { DataSource } from 'typeorm';

export const MongoDataSource = new DataSource({
  name: 'mongoConnection',
  type: 'mongodb',
  url: envs.mongodb_connection,
  entities: [__dirname + '/../../**/entities/mongodb/*.entity{.ts,.js}'],
  synchronize: true,
});
