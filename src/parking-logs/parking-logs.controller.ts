import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ParkingLogsService } from './parking-logs.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('parking-logs')
export class ParkingLogsController {
  constructor(private readonly parkingLogsService: ParkingLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all parking logs' })
  async getAll() {
    try {
      const response = await this.parkingLogsService.findAllParkingLogs();

      if (response.statusCode >= 400) {
        throw new HttpException(
          response.message || 'An internal error has occurred.',
          response.statusCode,
        );
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
