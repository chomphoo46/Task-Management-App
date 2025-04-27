import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ อนุญาต CORS แบบระบุ origin หรือเปิดหมดก็ได้
  app.enableCors({
    origin: 'http://localhost:5173', // frontend dev port
    credentials: true,
  });

  await app.listen(3000);
}
void bootstrap();
