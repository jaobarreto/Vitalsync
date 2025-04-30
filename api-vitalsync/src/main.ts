import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do payload máximo
  app.use(json({ limit: '10mb' }));

  // Configuração global de validação
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Converte automaticamente os tipos
      whitelist: true, // Remove propriedades não declaradas nos DTOs
      forbidNonWhitelisted: true, // Rejeita requisições com propriedades não declaradas
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('VitalSync API')
    .setDescription('API para monitoramento de saúde')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT',
      },
      'JWT-auth', // Este nome deve ser usado com @ApiBearerAuth('JWT-auth') nos controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
