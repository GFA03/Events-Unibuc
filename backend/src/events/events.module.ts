import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventDateTime } from './entities/event-date-time.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventDateTime]),
    AuthModule, // Provides JwtAuthGuard, RolesGuard
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService], // For other modules to be able to use event logic
})
export class EventsModule {}
