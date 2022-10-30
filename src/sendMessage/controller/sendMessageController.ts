import { Body, Controller, Get, Post } from "@nestjs/common";
import { SendMessageService } from "../business/sendMessageService";
import { SendMessageDTO } from "../dto/sendMessageDTO";

@Controller('sendMessage')
export class SendMessageController {
    constructor(private SendMessageService: SendMessageService){}

    @Post()
    async sendMessageText(@Body() sendMessage: SendMessageDTO){
        return await this.SendMessageService.sendMessage(sendMessage)
    }
    
    @Get()
    async statusServer(@Body() sendMessageText: SendMessageDTO){
        return await this.SendMessageService.getStatus() 
    }

}