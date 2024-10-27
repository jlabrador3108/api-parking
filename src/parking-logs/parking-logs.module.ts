import { Module } from '@nestjs/common';
import { ParkingLogsService } from './parking-logs.service';
import { ParkingLogsController } from './parking-logs.controller';
import { ParkingLog } from './entities/mongodb/parking-log.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from 'src/@config/envs';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ParkingLogsController],
  providers: [ParkingLogsService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.secret_key,
    }),
    TypeOrmModule.forFeature([ParkingLog], 'mongoConnection'),
    UsersModule,
  ],
  exports: [ParkingLogsService],
})
export class ParkingLogsModule {}
