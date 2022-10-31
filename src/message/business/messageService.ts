import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Repository } from "typeorm";
import { ChatEntity } from "../entity/chatExistEntity";
import { tb_messages } from "../entity/messagesEntity";
import { MessageRepository } from "../model/messageModel";


export class MessageService {
    constructor(
        private messageModel: MessageRepository,
        @InjectRepository(ChatEntity) private chatEntity:  Repository<ChatEntity>,
        @InjectRepository(tb_messages) private messages: Repository<tb_messages>
    ){}

    async chatExisting(user: any){        
        let chat = await this.messageModel.findLastChat(user.user)  

        if(chat == null || chat.inProgress == 0){
            const newUser = await this.createChat(user)
            const message = {
                idChat: newUser.id,
                message: user.message,
                user: newUser.user,
                nameClient: user.nameClient
            }
            await this.saveMessage(message)

            let chatSave = await this.messageModel.findLastChat(user.user)

            return this.verifyMessage(chatSave)
        }
        else if (chat.inProgress == 1){
            let lastChat = await this.messageModel.findLastChat(user.user)
            const message = {
                idChat: lastChat.id,
                message: user.message,
                user: user.user,
                nameClient: user.nameClient
            }
            await this.saveMessage(message)
            
            return await this.verifyMessage(chat)
        }

        return chat
    }

    async createChat(user: string){
        return await this.messageModel.createChat(user)
    }

    async saveMessage(message:any){
        return await this.messageModel.saveMessage(message)
    }

    async verifyMessage(chat: any){        
        try{
            const lastMessage = await this.messageModel.findLastMessage(chat)

            if(lastMessage.message == "Agendar"){
                try{
                    const { data } = await axios.post<any>(
                        `${process.env.API_HOST}venon`,
                        { to: lastMessage.messageFrom, body: "Certo, vamos escolher o dia, me responda de acordo com o exemplo: *01/01/2022*", type: "text", opcoes: {op1: "", op2: ""} },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            },
                        },
                    ); 
        
    
                    return data;
                }
                catch(error){
                    if(error.response.status == 404){
                        return new HttpException('Not Found', HttpStatus.NOT_FOUND)
                    }
                    
                    throw new Error(error)
                }
            }
            if(lastMessage.message == "Falar Com a TI"){
                try{
                    const { data } = await axios.post<any>(
                    `${process.env.API_HOST}venon`,
                    { to: lastMessage.messageFrom, body: "Ok! Um momento!", type: "text", opcoes: {op1: "", op2: ""} },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                            },
                        },
                    );


                    return data;
                }
                catch(error){
                    if(error.response.status == 404){
                        return new HttpException('Not Found', HttpStatus.NOT_FOUND)
                    }
                    
                    throw new Error(error)
                }
            }
            if(lastMessage.message[2] && lastMessage.message[5] == '/' && lastMessage.message.length == 10){
                try{
                    const { data } = await axios.post<any>(
                    `${process.env.API_HOST}venon`,
                    { to: lastMessage.messageFrom, body: "Ok! Agora escolha uma opção abaixo:", type: "button", opcoes: {op1: "Matutino", op2: "Noturno"} },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                            },
                        },
                    );


                    return data;
                }
                catch(error){
                    if(error.response.status == 404){
                        return new HttpException('Not Found', HttpStatus.NOT_FOUND)
                    }
                    
                    throw new Error(error)
                }
            }
            if(lastMessage.message == "Noturno" || lastMessage.message == "Matutino"){
                try{
                    const { data } = await axios.post<any>(
                    `${process.env.API_HOST}venon`,
                    { to: lastMessage.messageFrom, body: "Perfeito, Me Dê um momento por favor, deixe-me validar se está ok para agendarmos.", type: "text", opcoes: {op1: "", op2: ""} },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                            },
                        },
                    );

                    const dataTrello = await axios.post<any>(
                        `${process.env.API_HOST}venon`,
                        { client: lastMessage.messageFrom, turno: lastMessage.message, fromName: lastMessage.nameClient },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                                }, 
                        }
                    )
                }
                catch(error){
                    if(error.response.status == 404){                        
                        return new HttpException('Not Found', HttpStatus.NOT_FOUND)
                    }
                    
                    throw new Error(error)
                }
            }
            else{
                try{

                    const { data } = await axios.post<any>(
                        `${process.env.API_HOST}venon`,
                        { to: lastMessage.messageFrom, body: "*BOT:*\nOlá! Sou o bot da ti da FADESA e vamos começar. ", type: "text", opcoes: {op1: "", op2: "" } },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            },
                        },
                    );

                    
                    const data1 = await axios.post<any>(
                        `${process.env.API_HOST}venon`,
                        { to: lastMessage.messageFrom, body: "Primeiro: Escolha uma opção abaixo por favor:", type: "button", opcoes: {op1: "Agendar", op2: "Falar Com a TI" } },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            },
                        },
    
                    );

                    return data1;
                }
                catch(error){
                    if(error.response.status == 404){                        
                        throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
                    }
                    
                    throw new Error(error)
                }
            }
        }
        catch(error){
            if(error.response.status == 404){                
                return new HttpException('Not Found', HttpStatus.NOT_FOUND)
            }
            
            throw new Error(error)
        }
    }
}