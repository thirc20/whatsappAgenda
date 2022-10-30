import { Controller, Get, Body, Post } from '@nestjs/common';
import { MessageService } from '../business/messageService';

@Controller('message')
export class MessageController{
    constructor(private messageService: MessageService){}

    @Post()
    async findAllChats(@Body() user: any){
        return await this.messageService.chatExisting(user)
    }
}