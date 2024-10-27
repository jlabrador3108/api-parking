import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ParkingModule } from './parking/parking.module';
import { AppDataSource } from './database/config/data-source';
import { AuthModule } from './auth/auth.module';
import { ParkingLogsModule } from './parking-logs/parking-logs.module';
import { ParkingLog } from './parking-logs/entities/mongodb/parking-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    // TypeOrmModule.forRoot({
    //   ...MongoDataSource.options,
    // }),
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      url: 'mongodb://127.0.0.1:27017/parkings-logs',
      // host: 'localhost',
      // port: 27017,
      // database: 'parking-logs',
      entities: [ParkingLog],
      // useUnifiedTopology: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    ReservationsModule,
    ParkingModule,
    ParkingLogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
