import { envs } from 'src/@config/envs';
import { Parking } from '../../parking/entities/parking.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ database: envs.postgres_db })
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carPlate: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Parking, (parking) => parking.reservations)
  parking: Parking;
}
