import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    const userId = 67;
    const response = await this.reservationsService.create(
      userId,
      createReservationDto,
    );
    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.reservationsService.findAllReservations();

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Get('client')
  async findByClient() {
    const userId = 72;
    const response =
      await this.reservationsService.findReservationsByClient(userId);

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const userId = 67;
    const response = await this.reservationsService.findReservationById(
      userId,
      id,
    );

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Put(':id')
  async updateReservations(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const userId = 67;
    const response = await this.reservationsService.updateReservation(
      userId,
      id,
      updateReservationDto,
    );
    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Delete(':id')
  async cancelReservation(@Param('id', ParseIntPipe) id: number) {
    const userId = 67;
    const response = await this.reservationsService.cancelReservation(
      userId,
      id,
    );

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }
}
