import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { UsersModule } from 'src/users/users.module';
import { Parking } from 'src/parking/entities/parking.entity';
import { ParkingLogsModule } from 'src/parking-logs/parking-logs.module';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Reservation, Parking, User]),
    ParkingLogsModule,
  ],
  exports: [ReservationsService],
})
export class ReservationsModule {}
