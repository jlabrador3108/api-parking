import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Injectable()
export class RoleSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    const roleRepository = this.dataSource.getRepository(Role);

    const denominations = ['client', 'employee', 'admin'];

    const defaultRoles = await roleRepository.find({
      where: { denomination: In(denominations) },
    });

    if (defaultRoles.length === 0) {
      const roles = [
        {
          denomination: 'admin',
        },
        {
          denomination: 'employee',
        },
        {
          denomination: 'client',
        },
      ];

      await roleRepository.save(roles);
      console.log('🗂 created roles');
    } else {
      console.log('🗂 default roles already existing');
    }
  }
}
