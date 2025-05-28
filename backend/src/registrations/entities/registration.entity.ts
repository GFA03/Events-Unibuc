import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

@Entity('registrations')
@Unique(['userId', 'eventId']) // A user can only register once for a specific time slot
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Index()
  @Column('uuid')
  eventId: string;

  @ManyToOne(() => User, (user) => user.registrations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Event, (ev) => ev.registrations, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @CreateDateColumn()
  registrationDate: Date;
}
