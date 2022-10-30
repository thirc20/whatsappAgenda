import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from 'src/message/entity/chatExistEntity';
import { tb_messages } from 'src/message/entity/messagesEntity';
import { MessageModule } from 'src/message/messageModule';
import { TrelloService } from './business/trelloService';
import { TrelloController } from './controller/trelloController';
import { TrelloRepository } from './model/trelloModel';


@Module({
    imports: [MessageModule, TypeOrmModule.forFeature([ChatEntity, tb_messages])],
    controllers: [TrelloController],
    providers: [TrelloRepository, TrelloService]
})

export class TrelloModule{}