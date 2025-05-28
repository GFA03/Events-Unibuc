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
import { EventType } from './event-type.enum';
import { Registration } from '../../registrations/entities/registration.entity';

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

  @Index()
  @Column('datetime')
  startDateTime: Date;

  @Column('datetime')
  endDateTime: Date;

  @OneToMany(() => Registration, (registration) => registration.event)
  registrations: Registration[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
