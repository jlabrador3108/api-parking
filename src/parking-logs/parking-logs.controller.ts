import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { ParkingLogsService } from './parking-logs.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/@common/guards/auth.guard';
import { ParkingRoles } from 'src/@common/decorators/tecopay-roles.decorator';
import { ParkingRole } from 'src/@common/enums/roles.enum';

@Controller('parking-logs')
@ApiTags('Parking Logs')
@UseGuards(AuthGuard)
export class ParkingLogsController {
  constructor(private readonly parkingLogsService: ParkingLogsService) {}

  @Get()
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Get all parking logs' })
  async getAll() {
    const response = await this.parkingLogsService.findAllParkingLogs();

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }
}
