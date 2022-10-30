import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "src/message/entity/chatExistEntity";
import { tb_messages } from "src/message/entity/messagesEntity";
import { Repository } from "typeorm";


export class TrelloRepository{
    constructor(
        @InjectRepository(ChatEntity)
        private chatEntity:  Repository<ChatEntity>,
        @InjectRepository(tb_messages) private messages: Repository<tb_messages>
    ){}

    async findDate(client: any){
        let chatClient =  await this.chatEntity.find({
            where:{
                user: client.client,
                inProgress: 1

            }
        })
        
        let data = await this.messages.find({
            where: {
                messageFrom: client.client,
                idChat: String(chatClient[0].id)
            },
            order:{
                id: "DESC"
            }
        })

        return data

    }

    async endChat(client: string){
        this.chatEntity.query(`update bot.chat_entity set inProgress = 0 where messageFrom = ${client}`)
    }

}