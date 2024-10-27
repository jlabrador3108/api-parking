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
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
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
