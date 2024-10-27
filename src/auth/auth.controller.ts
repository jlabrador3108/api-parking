import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('login')
@ApiTags('Login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'User login' })
  async create(@Body() loginDto: LoginDto) {
    try {
      const response = await this.authService.login(loginDto);
      if (response.statusCode && response.message) {
        throw new HttpException(response.message, response.statusCode);
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
