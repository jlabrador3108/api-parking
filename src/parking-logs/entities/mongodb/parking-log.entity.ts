import { ObjectIdColumn, Column, Entity, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum Status {
  CREATED = 'created',
  UPDATED = 'updated',
  CANCELLED = 'cancelled',
}

@Entity()
export class ParkingLog {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column()
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED,
  })
  status: Status = Status.CREATED;
}
