import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AtGuard } from './auth/guards/at.guard';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalGuards(new AtGuard());
  await app.listen(process.env.PORT);
}
bootstrap();
