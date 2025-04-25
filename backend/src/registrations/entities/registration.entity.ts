import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { EventDateTime } from '../../events/entities/event-date-time.entity';
import { User } from '../../users/entities/user.entity';

@Entity('registrations')
@Unique(['userId', 'eventDateTimeId']) // A user can only register once for a specific time slot
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Index()
  @Column()
  eventDateTimeId: string;

  // @ManyToOne(() => User, user => user.registrations, { onDelete: 'CASCADE' })
  // user: User;
  //
  // @ManyToOne(() => EventDateTime, dt => dt.registrations, { onDelete: 'CASCADE' })
  // eventDateTime: EventDateTime;

  @CreateDateColumn()
  registrationDate: Date;
}
