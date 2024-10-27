import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateParkingLogDto } from './dto/create-parking-log.dto';
import { ParkingLog } from './entities/mongodb/parking-log.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ResponseData,
  ResponseMessage,
} from 'src/@common/interfaces/response.interface';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ParkingLogsService {
  constructor(
    @InjectRepository(ParkingLog, 'mongoConnection')
    private readonly parkingLogsRepository: MongoRepository<ParkingLog>,
    private usersService: UsersService,
  ) {}
  async create(
    createParkingLogDto: CreateParkingLogDto,
  ): Promise<ResponseData> {
    try {
      const log = this.parkingLogsRepository.create(createParkingLogDto);

      await this.parkingLogsRepository.save(log);

      return ResponseMessage({
        statusCode: HttpStatus.CREATED,
        data: log,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findAllParkingLogs(): Promise<ResponseData> {
    try {
      const logs = await this.parkingLogsRepository.find();

      return ResponseMessage({
        data: logs,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }
}
