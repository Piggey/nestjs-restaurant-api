import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const API_PORT = 3000;
const SWA_PORT = 4280;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: `http://localhost:${SWA_PORT}`,
    },
  });

  const docsConfig = new DocumentBuilder()
    .setTitle('Moduł sumatywny - Restauracje')
    .setDescription('Opis API systemu zarządzania siecią restauracji.')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(API_PORT);

  Logger.log(`Started server on http://localhost:${API_PORT}/`);
  Logger.log(`Swagger API documentation: http://localhost:${API_PORT}/docs`);
}

bootstrap();
