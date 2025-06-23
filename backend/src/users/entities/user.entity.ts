import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { Event } from '../../events/entities/event.entity';
import { Registration } from '../../registrations/entities/registration.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: String, nullable: true })
  passwordResetToken: string | null;

  @Column({ type: Date, nullable: true })
  passwordResetTokenExpires: Date | null;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100 })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: String, nullable: true })
  emailVerificationToken: string | null;

  @Column({ type: Date, nullable: true })
  emailVerificationTokenExpires: Date | null;

  @OneToMany(() => Event, (event) => event.organizer)
  organizedEvents: Event[];

  @OneToMany(() => Registration, (registration) => registration.user)
  registrations: Registration[];

  @CreateDateColumn() // Automatically set to the date/time when the record is created
  createdAt: Date;

  @UpdateDateColumn() // Automatically set to the date/time when the record is updated
  updatedAt: Date;
}
