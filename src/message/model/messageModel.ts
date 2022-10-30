import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatEntity } from "../entity/chatExistEntity";
import { tb_messages } from "../entity/messagesEntity";


export class MessageRepository{
    constructor(@InjectRepository(ChatEntity) private chatEntity:  Repository<ChatEntity>, @InjectRepository(tb_messages) private messages: Repository<tb_messages>){}

    async findLastChat(user: string){
        return this.chatEntity.findOne({
            where: {
                user: user
            },
            order: {
                id: "DESC"
            }
        })
    }

    async createChat(user:any){
        const inserChat = new ChatEntity()
        inserChat.inProgress = 1
        inserChat.user = user.user
        inserChat.nameClient = user.nameClient

        return await this.chatEntity.save(inserChat)
    }

    async saveMessage(msg: any){
        console.log(msg);
        

        const message = new tb_messages()
        message.messageFrom = msg.user;
        message.message = msg.message;
        message.idChat = msg.idChat;
        message.nameClient = msg.nameClient;

        
        console.log("message ", message);
        
        return await this.messages.save(message)
    }

    async findLastMessage(chat: any){
        console.log("chat ", chat);
        
        return await this.messages.findOne({
            where: {
                messageFrom: chat.user 
            },
            order: {
                id: "DESC"
            }
        })
    }
}