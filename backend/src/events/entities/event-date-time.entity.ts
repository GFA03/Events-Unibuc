import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity('event_date_times')
export class EventDateTime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @ManyToOne(() => Event, (event) => event.dateTimes, { onDelete: 'CASCADE' })
  event: Event;

  @Index()
  @Column('datetime')
  startDateTime: Date;

  @Column('datetime')
  endDateTime: Date;
}
