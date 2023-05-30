import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const API_PORT = process.env['API_PORT'];
const APP_PORT = process.env['SWA_PORT'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: `http://localhost:${APP_PORT}`,
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');

  const docsConfig = new DocumentBuilder()
    .setTitle('Moduł sumatywny - Restauracje')
    .setDescription('Opis API systemu zarządzania siecią restauracji.')
    .setVersion('0.1.0')
    .addBearerAuth()
    .setExternalDoc('JSON Web Tokens', 'https://jwt.io/')
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(API_PORT);

  Logger.log(`Started server on http://localhost:${API_PORT}/`);
  Logger.log(`Swagger API documentation: http://localhost:${API_PORT}/docs`);
}

bootstrap();
