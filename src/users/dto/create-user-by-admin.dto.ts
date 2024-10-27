import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { IsArray, ArrayMinSize, IsNumber, IsOptional } from 'class-validator';

export class CreateUserByAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsNumber({}, { each: true })
  public roles: number[];
}
