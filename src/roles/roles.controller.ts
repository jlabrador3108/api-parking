import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { AuthGuard } from 'src/@common/guards/auth.guard';
import { ParkingRoles } from 'src/@common/decorators/parking-roles.decorator';
import { ParkingRole } from 'src/@common/enums/roles.enum';
import { ParkingRolesGuard } from 'src/@common/guards/parking-roles.guard';

@Controller('roles')
@ApiTags('Roles')
@UseGuards(AuthGuard)
@UseGuards(ParkingRolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'New role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const response = await this.rolesService.create(createRoleDto);
    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Get()
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Get all roles' })
  async getAll() {
    const response = await this.rolesService.findAllRoles();

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Get(':id')
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Get role by id' })
  async getRoleById(@Param('id', ParseIntPipe) id: number) {
    const response = await this.rolesService.findById(id);

    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Put(':id')
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Update role' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: CreateRoleDto,
  ) {
    const response = await this.rolesService.update(id, updateRoleDto);
    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }

  @Delete(':id')
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Delete role' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.rolesService.remove(id);
    if (response.statusCode >= 400) {
      throw new HttpException(
        response.message || 'An internal error has occurred.',
        response.statusCode,
      );
    }
    return response;
  }
}
