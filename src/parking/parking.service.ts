import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { Parking } from './entities/parking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ResponseData,
  ResponseMessage,
} from 'src/@common/interfaces/response.interface';
import { ReservationsService } from 'src/reservations/reservations.service';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,
    private reservationsService: ReservationsService,
  ) {}

  async create(createParkingDto: CreateParkingDto): Promise<ResponseData> {
    try {
      const { denomination } = createParkingDto;

      const existingParking = await this.parkingRepository.findOne({
        where: { denomination },
      });
      if (existingParking) {
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Parking already existing.',
        });
      }
      const parking = this.parkingRepository.create(createParkingDto);

      await this.parkingRepository.save(parking);

      return ResponseMessage({
        statusCode: HttpStatus.CREATED,
        data: parking,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async update(
    id: number,
    updateParkingDto: UpdateParkingDto,
  ): Promise<ResponseData> {
    try {
      const { denomination } = updateParkingDto;

      const response = await this.findById(id);

      if (!response.data) return response;

      const parking = response.data;

      if (denomination) {
        const existingParking = await this.parkingRepository.findOne({
          where: { denomination },
        });
        if (existingParking) {
          return ResponseMessage({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Parking already existing.',
          });
        }
      }

      const newParking = await this.parkingRepository.merge(
        parking,
        updateParkingDto,
      );

      this.parkingRepository.save(newParking);

      return ResponseMessage({
        data: newParking,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findAllParking(): Promise<ResponseData> {
    try {
      const parking = await this.parkingRepository.find();

      return ResponseMessage({
        data: parking,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findById(id: number): Promise<ResponseData> {
    try {
      const parking = await this.parkingRepository.findOne({
        where: { id },
      });
      if (!parking) {
        return ResponseMessage({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Parking not found.',
        });
      }
      return ResponseMessage({
        data: parking,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async remove(id: number): Promise<ResponseData> {
    try {
      const response = await this.findById(id);

      if (!response.data) return response;

      const parkingInReservations =
        await this.reservationsService.getReservationByParking(id);

      if (parkingInReservations)
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'There are reservations assigned to the parking',
        });

      const parking = response.data;
      await this.parkingRepository.remove(parking);

      return ResponseMessage({
        message: 'Parking successfully deleted',
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }
}
