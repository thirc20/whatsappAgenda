import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitializeVenonBot } from 'src/venonBot/business/venonBotService';
import { MessageService } from './business/messageService';
import { MessageController } from './controller/messageController';
import { ChatEntity } from './entity/chatExistEntity';
import { tb_messages } from './entity/messagesEntity';
import { MessageRepository } from './model/messageModel';


@Module({
    imports: [TypeOrmModule.forFeature([ChatEntity, tb_messages])],
    controllers: [MessageController],
    providers: [MessageService, MessageRepository, ChatEntity, tb_messages],
    exports: [ChatEntity, tb_messages]
})

export class MessageModule {}