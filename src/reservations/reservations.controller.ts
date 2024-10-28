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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/@common/guards/auth.guard';
import { ParkingRoles } from 'src/@common/decorators/tecopay-roles.decorator';
import { ParkingRole } from 'src/@common/enums/roles.enum';

@Controller('reservations')
@ApiTags('Reservations')
@UseGuards(AuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].id;
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
  @ParkingRoles(ParkingRole.ADMIN, ParkingRole.EMPLOYEE)
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
  async findByClient(@Req() request: Request) {
    const userId = request['user'].id;
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
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userId = request['user'].id;
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
    @Req() request: Request,
  ) {
    const userId = request['user'].id;
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
  async cancelReservation(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userId = request['user'].id;
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
