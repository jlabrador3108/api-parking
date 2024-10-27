import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public carPlate: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  public startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  public endDate: Date;
}
