import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

@Injectable()
export class UserSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    const userRepository = this.dataSource.getRepository(User);

    const roleRepository = this.dataSource.getRepository(Role);

    const roles = await roleRepository.find();

    const emails = [
      'cliente@parking.com',
      'empleado@parking.com',
      'admin@parking.com',
    ];

    const defaultUsers = await userRepository.find({
      where: { email: In(emails) },
    });

    if (defaultUsers.length === 0) {
      const users = [
        {
          email: 'cliente@parking.com',
          password: '1234',
          name: 'Cliente',
          phone: '55555555',
          roles: roles.filter((role) => role.denomination === 'client'),
        },
        {
          email: 'empleado@parking.com',
          password: '1234',
          name: 'Empleado',
          phone: '55555555',
          roles: roles.filter((role) => role.denomination === 'employee'),
        },
        {
          email: 'admin@parking.com',
          password: '1234',
          name: 'Administrador',
          phone: '55555555',
          roles: roles.filter((role) => role.denomination === 'admin'),
        },
      ];

      await userRepository.save(users);
      console.log('🙍‍♂️ created users');
    } else {
      console.log('🙍‍♂️ default users already existing');
    }
  }
}
