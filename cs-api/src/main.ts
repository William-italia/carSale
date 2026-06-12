import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      //ignora campos extras, só se "importa" com campos que estão mapeados no dto
      whitelist: true,
      // retorna erro se campos extras forem enviados
        // forbidNonWhitelisted: true,

      // Converte o json recebido para uma instancia da classe DTO correspondente
      transform: true,
    }),
  )

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
