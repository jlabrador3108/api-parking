import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { AuthGuard } from 'src/@common/guards/auth.guard';
import { ParkingRoles } from 'src/@common/decorators/tecopay-roles.decorator';
import { ParkingRole } from 'src/@common/enums/roles.enum';

@Controller('role')
@ApiTags('Role')
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'New role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const response = await this.rolesService.create(createRoleDto);
      if (response.statusCode >= 400) {
        throw new HttpException(
          response.message || 'An internal error has occurred.',
          response.statusCode,
        );
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Get all roles' })
  async getAll() {
    try {
      const response = await this.rolesService.findAllRoles();

      if (response.statusCode >= 400) {
        throw new HttpException(
          response.message || 'An internal error has occurred.',
          response.statusCode,
        );
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Get role by id' })
  async getRoleById(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await this.rolesService.findById(id);

      if (response.statusCode >= 400) {
        throw new HttpException(
          response.message || 'An internal error has occurred.',
          response.statusCode,
        );
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Update role' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: CreateRoleDto,
  ) {
    try {
      const response = await this.rolesService.update(id, updateRoleDto);
      if (response.statusCode >= 400) {
        throw new HttpException(
          response.message || 'An internal error has occurred.',
          response.statusCode,
        );
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Delete role' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await this.rolesService.remove(id);
      if (response.statusCode >= 400) {
        throw new HttpException(
          response.message || 'An internal error has occurred.',
          response.statusCode,
        );
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
