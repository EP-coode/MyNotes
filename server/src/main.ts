import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalGuards(new AtGuard());
  const config = new DocumentBuilder()
    .setTitle('Notes api')
    .setDescription('Simple api that allows you to store your notes')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'jwt-acces',
        description: 'enter JWT acces token',
        in: 'header',
      },
      'jwt-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'jwt-refresh',
        description: 'enter JWT refresh token',
        in: 'header',
      },
      'jwt-refresh',
    )
    .addTag('notes')
    .build();

  const documnet = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documnet);

  await app.listen(process.env.PORT);
}
bootstrap();
