import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { Parking } from './entities/parking.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from 'src/@config/envs';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  controllers: [ParkingController],
  providers: [ParkingService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.secret_key,
    }),
    TypeOrmModule.forFeature([Parking]),
    ReservationsModule,
  ],
})
export class ParkingModule {}
