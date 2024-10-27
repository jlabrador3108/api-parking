import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  ResponseData,
  ResponseMessage,
} from 'src/@common/interfaces/response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<ResponseData> {
    try {
      const { denomination } = createRoleDto;

      const existingRole = await this.rolesRepository.findOne({
        where: { denomination },
      });
      if (existingRole) {
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Role already existing.',
        });
      }
      const role = this.rolesRepository.create(createRoleDto);

      await this.rolesRepository.save(role);

      return ResponseMessage({
        statusCode: HttpStatus.CREATED,
        data: role,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async update(
    id: number,
    updateRoleDto: CreateRoleDto,
  ): Promise<ResponseData> {
    try {
      const { denomination } = updateRoleDto;

      const response = await this.findById(id);

      if (!response.data) return response;

      const role = response.data;

      const existingRole = await this.rolesRepository.findOne({
        where: { denomination },
      });
      if (existingRole) {
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Role already existing.',
        });
      }

      const newRole = await this.rolesRepository.merge(role, updateRoleDto);

      this.rolesRepository.save(newRole);

      return ResponseMessage({
        data: newRole,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findAllRoles(): Promise<ResponseData> {
    try {
      const roles = await this.rolesRepository.find();

      return ResponseMessage({
        data: roles,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findById(id: number): Promise<ResponseData> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id },
      });
      if (!role) {
        return ResponseMessage({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Role not found.',
        });
      }
      return ResponseMessage({
        data: role,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async remove(id: number): Promise<ResponseData> {
    try {
      const response = await this.findById(id);

      if (!response.data) return response;

      const roleInUsers = await this.usersService.getUserByRole(id);

      if (roleInUsers)
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'There are users assigned to the role',
        });

      const role = response.data;
      await this.rolesRepository.remove(role);

      return ResponseMessage({
        message: 'Role successfully deleted',
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }
}
