import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Registration } from '../../registrations/entities/registration.entity';

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

  // @OneToMany(() => Registration, (registration) => registration.eventDateTime)
  // registrations: Registration[];
}
