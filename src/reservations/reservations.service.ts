import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from 'src/parking/entities/parking.entity';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { UsersService } from 'src/users/users.service';
import {
  ResponseData,
  ResponseMessage,
} from 'src/@common/interfaces/response.interface';
import { ParkingRole } from 'src/@common/enums/roles.enum';
import { ParkingLogsService } from 'src/parking-logs/parking-logs.service';
import {
  ParkingLog,
  Status,
} from 'src/parking-logs/entities/mongodb/parking-log.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,
    private logsService: ParkingLogsService,
  ) {}

  async create(
    userId: number,
    createReservationDto: CreateReservationDto,
  ): Promise<ResponseData> {
    try {
      const { startDate, endDate } = createReservationDto;

      const existingUser = await this.usersService.findById(userId);
      if (!existingUser.data) {
        return existingUser;
      }

      if (startDate >= endDate || startDate <= new Date()) {
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'Invalid date. Date and time must be greater than the current one. End date must not be less than start date.',
        });
      }

      const parkingAvailable = await this.getParkingAvailable(
        startDate,
        endDate,
      );

      if (parkingAvailable.length === 0) {
        return ResponseMessage({
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: 'There is no parking availability for this time range.',
        });
      }

      const reservation =
        this.reservationsRepository.create(createReservationDto);

      const indexParking = Math.floor(Math.random() * parkingAvailable.length);

      reservation.user = existingUser.data;
      reservation.parking = parkingAvailable[indexParking];

      await this.reservationsRepository.save(reservation);

      delete reservation.user.password;

      const log: ParkingLog = {
        userId: reservation.user.id,
        startDate,
        endDate,
        status: Status.CREATED,
      };

      this.logsService.create(log);

      return ResponseMessage({
        statusCode: HttpStatus.CREATED,
        data: reservation,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findAllReservations(): Promise<ResponseData> {
    try {
      const reservations = await this.reservationsRepository.find({
        relations: ['parking', 'user'],
        select: {
          user: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      });

      return ResponseMessage({
        data: reservations,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async updateReservation(
    userId: number,
    reservationId: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ResponseData> {
    try {
      let { startDate, endDate } = updateReservationDto;

      const response = await this.findReservationById(userId, reservationId);

      if (!response.data) return response;

      const reservation = response.data;

      if (startDate || endDate) {
        if (!startDate) startDate = reservation.startDate;
        if (!endDate) endDate = reservation.endDate;

        if (startDate >= endDate || startDate <= new Date()) {
          return ResponseMessage({
            statusCode: HttpStatus.BAD_REQUEST,
            message:
              'Invalid date. Date and time must be greater than the current one. End date must not be less than start date.',
          });
        }

        const parkingAvailable = await this.getParkingAvailable(
          startDate,
          endDate,
        );

        if (parkingAvailable.length === 0) {
          return ResponseMessage({
            statusCode: HttpStatus.NOT_ACCEPTABLE,
            message: 'There is no parking availability for this time range.',
          });
        }

        const indexParking = Math.floor(
          Math.random() * parkingAvailable.length,
        );

        reservation.parking = parkingAvailable[indexParking];
      }

      Object.assign(reservation, updateReservationDto);

      await this.reservationsRepository.save(reservation);

      const log: ParkingLog = {
        userId: reservation.user.id,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: Status.UPDATED,
      };

      this.logsService.create(log);

      return ResponseMessage({
        data: reservation,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findReservationById(userId: number, id: number): Promise<ResponseData> {
    try {
      const existingUser = await this.usersService.findById(userId);
      if (!existingUser.data) {
        return existingUser;
      }

      const reservation = await this.reservationsRepository.findOne({
        relations: ['parking', 'user'],
        where: { id },
        select: {
          user: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      });

      if (!reservation) {
        return ResponseMessage({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Reservation not found.',
        });
      }

      if (
        existingUser.data.roles.length === 1 &&
        existingUser.data.roles[0].denomination === ParkingRole.CLIENT
      ) {
        if (reservation.user.id !== userId) {
          //if the reservation does not belong to the user
          return ResponseMessage({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Reservation not found.',
          });
        }
      }

      return ResponseMessage({
        data: reservation,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findReservationsByClient(userId: number): Promise<ResponseData> {
    try {
      const reservations = await this.reservationsRepository.find({
        relations: ['parking', 'user'],
        where: { user: { id: userId } },
        select: {
          user: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      });

      return ResponseMessage({
        data: reservations,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async cancelReservation(
    userId: number,
    reservationId: number,
  ): Promise<ResponseData> {
    try {
      const response = await this.findReservationById(userId, reservationId);

      if (!response.data) return response;

      const reservation = response.data;
      await this.reservationsRepository.remove(reservation);

      const log: ParkingLog = {
        userId: reservation.user.id,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: Status.CREATED,
      };

      this.logsService.create(log);

      return ResponseMessage({
        message: 'Reservation successfully cancelled',
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async getParkingAvailable(
    startDate: Date,
    endDate: Date,
  ): Promise<Parking[]> {
    return await this.parkingRepository
      .createQueryBuilder('parking')
      .leftJoin('parking.reservations', 'reservation')
      .where(
        `NOT EXISTS (
      SELECT 1 
      FROM reservation 
      WHERE reservation.parkingId = parking.id
      AND (
        (reservation.startDate <= :endDate AND reservation.endDate >= :startDate)
      )
    )`,
        { startDate, endDate },
      )
      .getMany();
  }

  async getReservationByParking(
    parkingId: number,
  ): Promise<Reservation | null> {
    return await this.reservationsRepository.findOne({
      relations: ['parking'],
      where: {
        parking: { id: parkingId },
      },
    });
  }
}
