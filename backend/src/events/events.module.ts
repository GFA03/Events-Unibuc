import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { AuthModule } from '../auth/auth.module';
import { TagsModule } from '../tags/tags.module';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    AuthModule, // Provides JwtAuthGuard, RolesGuard
    TagsModule,
    FileUploadModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService], // For other modules to be able to use event logic
})
export class EventsModule {}
