import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomLogger } from './utils/logger.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  // Helmet should be used to secure HTTP headers, before any other app.use
  app.use(helmet());

  app.enableCors({
    // origin: [
    //   'http://localhost:3000', // Your frontend URL
    //   'https://yourdomain.com', // Your production domain
    // ],
    // credentials: true, // Allow cookies to be sent
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });
  // Catch all exceptions
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transform payloads to DTO instances
      disableErrorMessages: process.env.NODE_ENV === 'production', // Disable detailed errors in prod
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Evenimente Unibuc')
    .setDescription('Site pentru evenimentele facultatii')
    .setVersion('1.0')
    .addServer('http://localhost:3001/', 'Local environment')
    .addTag('EventsUnibuc')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
