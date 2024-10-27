import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
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
import { ParkingRoles } from 'src/@common/decorators/tecopay-roles.decorator';

@Controller('parking')
@ApiTags('Parking')
@UseGuards(AuthGuard)
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'New parking' })
  async create(@Body() createParkingDto: CreateParkingDto) {
    try {
      const response = await this.parkingService.create(createParkingDto);
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

  @Get()
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get all parking' })
  async getAll() {
    try {
      const response = await this.parkingService.findAllParking();

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

  @Get(':id')
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get parking by id' })
  async getParkingById(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await this.parkingService.findById(id);

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

  @Put(':id')
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'Update parking' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParkingDto: UpdateParkingDto,
  ) {
    try {
      const response = await this.parkingService.update(id, updateParkingDto);
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

  @Delete(':id')
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
  @ApiOperation({ summary: 'Delete parking' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await this.parkingService.remove(id);
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
