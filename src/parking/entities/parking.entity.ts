import { envs } from 'src/@config/envs';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: envs.postgres_db })
export class Parking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  denomination: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Reservation, (reservation) => reservation.parking, {
    onDelete: 'CASCADE',
  })
  reservations?: Reservation[];
}
