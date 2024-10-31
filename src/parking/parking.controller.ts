import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/@common/guards/auth.guard';
import { ParkingRole } from 'src/@common/enums/roles.enum';
import { ParkingRoles } from 'src/@common/decorators/parking-roles.decorator';
import { ParkingRolesGuard } from 'src/@common/guards/parking-roles.guard';

@Controller('parking')
@ApiTags('Parking')
@UseGuards(AuthGuard)
@UseGuards(ParkingRolesGuard)
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'New parking' })
  async create(@Body() createParkingDto: CreateParkingDto) {
    const response = await this.parkingService.create(createParkingDto);
    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Get()
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get all parking' })
  async getAll() {
    const response = await this.parkingService.findAllParking();

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Get(':id')
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get parking by id' })
  async getParkingById(@Param('id', ParseIntPipe) id: number) {
    const response = await this.parkingService.findById(id);

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Put(':id')
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'Update parking' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParkingDto: UpdateParkingDto,
  ) {
    const response = await this.parkingService.update(id, updateParkingDto);
    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Delete(':id')
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'Delete parking' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.parkingService.remove(id);
    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }
}
