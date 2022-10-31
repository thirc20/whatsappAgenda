import { SendMessageDTO } from "../dto/sendMessageDTO"
import { Whatsapp } from "venom-bot"
import { InitializeVenonBot } from "src/venonBot/business/venonBotService"
import { VenonBotController } from "src/venonBot/controller/venonBotController"
import axios from 'axios';


export class SendMessageService {
    constructor(private whatsapp: InitializeVenonBot){
    }
    async getStatus(){
        let bodyReturn = {
            "Status Srv": "Server Online",
            "Status Code": "200"
        }
        return JSON.stringify(bodyReturn)
    }

    async sendMessage(sendMessage: SendMessageDTO){
        if(sendMessage.type == "text"){
            return await this.sendMessageText(sendMessage)
        }else if(sendMessage.type == "button"){
            return await this.sendMessageButton(sendMessage)
        }
    }

    async sendMessageText(sendMessageText: SendMessageDTO){
        try{            
            const { data } = await axios.post<SendMessageDTO>(
                `${process.env.API_HOST}venon`,
                { to: sendMessageText.to, body: sendMessageText.body, type: sendMessageText.type },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                },
            );
            console.log(JSON.stringify(data, null, 4));
                
            return data
        }
        catch (error){
            if(axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                return error.message
            } else {
                console.log('unexpected error: ', error);
                throw new Error(error)
                                
            }
        }
    }

    async sendMessageButton(sendMessageButton: SendMessageDTO){
        try{            
            // const { data } = await axios.post<SendMessageDTO>(
            //     'http://localhost:7070/venon',
            //     { to: sendMessageButton.to, body: sendMessageButton.body, type: sendMessageButton.type },
            //     {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             Accept: 'application/json'
            //         },
            //     },
            // );
            // console.log(JSON.stringify(data, null, 4));
                
            // return data
        }
        catch (error){
            if(axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                return error.message
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred'                
            }
        }
    }
}