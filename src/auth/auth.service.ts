import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-auth.dto';
import {
  ResponseData,
  ResponseMessage,
} from 'src/@common/interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(user: LoginDto): Promise<any> {
    const existingUser = await this.usersService.findOne(user.email);

    if (existingUser.data && existingUser.data.password === user.password) {
      const { password, ...result } = existingUser.data;
      return result;
    }

    return null;
  }

  async login(user: LoginDto): Promise<ResponseData> {
    try {
      const existingUser = await this.validateUser(user);
      if (!existingUser)
        return ResponseMessage({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid user',
        });

      const payload = {
        id: existingUser.id,
      };

      return ResponseMessage({
        statusCode: HttpStatus.CREATED,
        data: {
          access_token: this.jwtService.sign(payload),
        },
      });
    } catch (error) {
      return ResponseMessage({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }
}
