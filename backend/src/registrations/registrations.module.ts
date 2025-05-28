import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './entities/registration.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration, Event]),
    AuthModule,
    EventsModule,
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
