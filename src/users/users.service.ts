import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ResponseData,
  ResponseMessage,
} from 'src/@common/interfaces/response.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { ParkingRole } from 'src/@common/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseData> {
    try {
      const { email } = createUserDto;

      const existingUser = await this.findOne(email);
      if (existingUser.data) {
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email already existing.',
        });
      }
      const user = this.usersRepository.create(createUserDto);

      //users are created with client role
      const roles = await this.rolesRepository.find();
      user.roles = roles.filter(
        (role) => role.denomination === ParkingRole.CLIENT,
      );

      await this.usersRepository.save(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { roles: _, ...toReturn } = user;

      return ResponseMessage({
        statusCode: HttpStatus.CREATED,
        data: toReturn,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseData> {
    try {
      const { email, roles: roleIds } = updateUserDto;

      const existingUser = await this.usersRepository.findOneBy({ id: userId });
      if (!existingUser) {
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found.',
        });
      }

      if (email && email !== existingUser.email) {
        const existingEmail = await this.findOne(email);
        if (existingEmail.data) {
          return ResponseMessage({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Email already existing.',
          });
        }
      }

      const roles = await this.rolesRepository.find({
        where: { id: In(roleIds) },
      });

      if (roles.length !== roleIds.length) {
        return ResponseMessage({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Some of the submitted roles are not found.',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { roles: _, ...props } = updateUserDto;

      const user = await this.usersRepository.merge(existingUser, props);

      user.roles = roles;

      this.usersRepository.save(user);

      return ResponseMessage({
        statusCode: HttpStatus.CREATED,
        data: user,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findOne(email: string): Promise<ResponseData> {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        return ResponseMessage({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Email does not exist.',
        });
      }
      return ResponseMessage({
        data: user,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findAllUsers(): Promise<ResponseData> {
    try {
      const users = await this.usersRepository.find({
        relations: ['roles'],
      });

      return ResponseMessage({
        data: users,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async updateUserRoles(
    userId: number,
    roleIds: number[],
  ): Promise<ResponseData> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      return ResponseMessage({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found.',
      });
    }

    const roles = await this.rolesRepository.find({
      where: { id: In(roleIds) },
    });

    if (roles.length !== roleIds.length) {
      return ResponseMessage({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Some of the submitted roles are not found.',
      });
    }

    user.roles = roles;

    const newUser = await this.usersRepository.save(user);

    return ResponseMessage({
      data: newUser,
    });
  }

  async createByAdmin(
    createUserDto: CreateUserByAdminDto,
  ): Promise<ResponseData> {
    try {
      const { email, roles: roleIds } = createUserDto;

      const existingUser = await this.findOne(email);
      if (existingUser.data) {
        return ResponseMessage({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email already existing.',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { roles: _, ...newUser } = createUserDto;

      const roles = await this.rolesRepository.find({
        where: { id: In(roleIds) },
      });

      if (roles.length !== roleIds.length) {
        return ResponseMessage({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Some of the submitted roles are not found.',
        });
      }

      const user = this.usersRepository.create(newUser);

      user.roles = roles;

      await this.usersRepository.save(user);

      return ResponseMessage({
        statusCode: HttpStatus.CREATED,
        data: user,
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
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['roles'],
      });
      if (!user) {
        return ResponseMessage({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found.',
        });
      }
      return ResponseMessage({
        data: user,
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async getUserByRole(roleId: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      relations: ['roles'],
      where: {
        roles: { id: roleId },
      },
    });
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['roles'],
    });
    return user?.roles.map((role) => role.denomination) || [];
  }
}
