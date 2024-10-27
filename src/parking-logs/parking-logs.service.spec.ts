import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLogsService } from './parking-logs.service';

describe('ParkingLogsService', () => {
  let service: ParkingLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingLogsService],
    }).compile();

    service = module.get<ParkingLogsService>(ParkingLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
