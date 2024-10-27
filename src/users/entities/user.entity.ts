import { envs } from 'src/@config/envs';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Role } from '../../roles/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ database: envs.postgres_db })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations?: Reservation[];
}
