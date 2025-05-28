import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    AuthModule, // Provides JwtAuthGuard, RolesGuard
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService], // For other modules to be able to use event logic
})
export class EventsModule {}
