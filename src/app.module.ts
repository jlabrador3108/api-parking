import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ParkingModule } from './parking/parking.module';
import { AppDataSource } from './database/config/data-source';
import { AuthModule } from './auth/auth.module';
import { ParkingLogsModule } from './parking-logs/parking-logs.module';
import { MongoDataSource } from './database/config/data-source-mongo';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    TypeOrmModule.forRoot({
      ...MongoDataSource.options,
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
