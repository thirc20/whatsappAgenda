import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/messageModule';
import { ChatEntity } from './message/entity/chatExistEntity';
import { tb_messages } from './message/entity/messagesEntity';
import { TrelloModule } from './trello/trelloModule';
import { VenonBotModule } from './venonBot/venonBotModule';
require('dotenv').config()


@Module({
  imports: [
    // SendMessageModule, 
    VenonBotModule, 
    MessageModule,
    TrelloModule,
    TypeOrmModule.forRoot(
      {
        type: "mysql",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: true,
        entities: [ChatEntity, tb_messages]
      }
    )
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
