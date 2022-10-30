import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module:any

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(7070);

  if(module.hot){
    module.hot.accept();
    module.hot.dispose(() => app.close())
  }

  Logger.log(`server is running on port 7070`, 'bootstrap')
  
}
bootstrap();
