import { Module } from "@nestjs/common";
import { SendMessageService } from "./business/sendMessageService";
import { SendMessageController } from "./controller/sendMessageController";


@Module({
    imports: [],
    controllers: [SendMessageController],
    providers: [SendMessageService],
})

export class SendMessageModule {}