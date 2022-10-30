import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/messageModule';
import { ChatEntity } from './message/entity/chatExistEntity';
import { tb_messages } from './message/entity/messagesEntity';
import { TrelloModule } from './trello/trelloModule';
import { VenonBotModule } from './venonBot/venonBotModule';


@Module({
  imports: [
    // SendMessageModule, 
    VenonBotModule, 
    MessageModule,
    TrelloModule,
    TypeOrmModule.forRoot(
      {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "password",
        database: "bot",
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
