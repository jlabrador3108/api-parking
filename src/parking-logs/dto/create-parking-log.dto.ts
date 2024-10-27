import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Status } from '../entities/mongodb/parking-log.entity';

export class CreateParkingLogDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  public startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  public endDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  public userId: number;

  @ApiProperty()
  @IsEnum(Status, {
    message: 'Status must be one of: created, updated, deleted',
  })
  @IsOptional()
  status?: Status;
}
