import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { Event } from './events/entities/event.entity';
import { EventDateTime } from './events/entities/event-date-time.entity';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Specify the env file path
    }),
    // Configure TypeORM connection using ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here as well
      inject: [ConfigService], // Inject ConfigService to use it
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'), // Read host from env
        port: configService.get<number>('DATABASE_PORT'), // Read port from env
        username: configService.get<string>('DATABASE_USER'), // Read user from env
        password: configService.get<string>('DATABASE_PASSWORD'), // Read password from env
        database: configService.get<string>('DATABASE_NAME'), // Read database name from env
        entities: [User, Event, EventDateTime],
        // synchronize: true, // Keep for dev, disable for prod (use migrations)
        // Recommended for dev inside Docker:
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        // logging: configService.get<string>('NODE_ENV') === 'development', // Optional: log SQL in dev
      }),
    }),
    // Import other modules
    UsersModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
