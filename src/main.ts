import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const docsConfig = new DocumentBuilder()
    .setTitle('Moduł sumatywny - Restauracje')
    .setDescription('Opis API systemu zarządzania siecią restauracji.')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);
  Logger.log(`Swagger API documentation: http://localhost:${PORT}/docs`);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(PORT);
  Logger.log(`Started server on http://localhost:${PORT}/`);
}

bootstrap();
