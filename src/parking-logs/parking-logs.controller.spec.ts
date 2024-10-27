import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLogsController } from './parking-logs.controller';
import { ParkingLogsService } from './parking-logs.service';

describe('ParkingLogsController', () => {
  let controller: ParkingLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingLogsController],
      providers: [ParkingLogsService],
    }).compile();

    controller = module.get<ParkingLogsController>(ParkingLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
