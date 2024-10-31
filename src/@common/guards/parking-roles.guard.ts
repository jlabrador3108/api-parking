import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ParkingRole } from '../enums/roles.enum';
import { PARKING_ROLES_KEY } from '../decorators/parking-roles.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ParkingRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ParkingRole[]>(
      PARKING_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const userRoles = await this.usersService.getUserRoles(userId);

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
