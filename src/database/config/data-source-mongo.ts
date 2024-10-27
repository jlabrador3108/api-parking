import { DataSource } from 'typeorm';

export const MongoDataSource = new DataSource({
  type: 'mongodb',
  url: 'mongodb://localhost:27017/parking-logs',
  entities: [__dirname + '/../../**/entities/mongodb/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
});
