import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { Parking } from '../../parking/entities/parking.entity';

@Injectable()
export class ParkingSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    const parkingRepository = this.dataSource.getRepository(Parking);

    const denominations = ['A', 'B'];

    const defaultParking = await parkingRepository.find({
      where: { denomination: In(denominations) },
    });

    if (defaultParking.length === 0) {
      const parking = [
        {
          denomination: 'A',
        },
        {
          denomination: 'B',
        },
      ];

      await parkingRepository.save(parking);
      console.log('🅿 created parking');
    } else {
      console.log('🅿 default parking already existing');
    }
  }
}
