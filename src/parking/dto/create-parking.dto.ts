import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateParkingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public denomination: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public description: string;
}
