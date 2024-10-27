import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envs } from 'src/@config/envs';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.secret_key,
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
