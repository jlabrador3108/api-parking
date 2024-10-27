import { envs } from 'src/@config/envs';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: envs.postgres_db })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  denomination: string;
}
