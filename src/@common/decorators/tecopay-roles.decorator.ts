import { SetMetadata } from '@nestjs/common';
import { ParkingRole } from '../enums/roles.enum';

export const PARKING_ROLES_KEY = 'parking_roles';
export const ParkingRoles = (...parkingRoles: ParkingRole[]) =>
  SetMetadata(PARKING_ROLES_KEY, parkingRoles);
