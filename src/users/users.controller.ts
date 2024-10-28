import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Put,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { AuthGuard } from 'src/@common/guards/auth.guard';
import { ParkingRoles } from 'src/@common/decorators/tecopay-roles.decorator';
import { ParkingRole } from 'src/@common/enums/roles.enum';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'New user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const response = await this.usersService.create(createUserDto);
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

  @Post('admin')
  @UseGuards(AuthGuard)
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'New user by admin' })
  async createUserByAdmin(@Body() createUserDto: CreateUserByAdminDto) {
    try {
      const response = await this.usersService.createByAdmin(createUserDto);
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
  @UseGuards(AuthGuard)
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    try {
      const response = await this.usersService.findAllUsers();

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
  @UseGuards(AuthGuard)
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Get user by id' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await this.usersService.findById(id);

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
  @UseGuards(AuthGuard)
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const response = await this.usersService.updateUser(
        userId,
        updateUserDto,
      );
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

  @Put(':id/roles')
  @UseGuards(AuthGuard)
  @ParkingRoles(ParkingRole.ADMIN)
  @ApiOperation({ summary: 'Update roles in user' })
  async updateRoles(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateRolesDto: UpdateRolesDto,
  ) {
    try {
      const response = await this.usersService.updateUserRoles(
        userId,
        updateRolesDto.roles,
      );
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
