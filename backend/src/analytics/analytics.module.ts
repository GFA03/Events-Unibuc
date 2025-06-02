import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { EventsModule } from '../events/events.module';
import { RegistrationsModule } from '../registrations/registrations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from '../registrations/entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration, Event]),
    AuthModule, // Provides JwtAuthGuard, RolesGuard
    EventsModule,
    RegistrationsModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
