import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventDateTime } from './event-date-time.entity';
import { EventType } from './event-type.enum';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.EVENT,
  })
  type: EventType;

  @Index()
  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column()
  organizerId: string; // Foreign key to users table

  @ManyToOne(() => User, (user) => user.organizedEvents, {
    onDelete: 'CASCADE',
  })
  organizer: User;

  @OneToMany(() => EventDateTime, (eventDateTime) => eventDateTime.event, {
    cascade: true, // delete dateTimes when event is deleted
    eager: true, // load dateTimes eagerly
  })
  dateTimes: EventDateTime[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
