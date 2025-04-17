import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100 })
  phoneNumber: string;

  @CreateDateColumn() // Automatically set to the date/time when the record is created
  createdAt: Date;

  @UpdateDateColumn() // Automatically set to the date/time when the record is updated
  updatedAt: Date;
}
