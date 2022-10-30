import { create, Whatsapp, Message, SocketState } from "venom-bot"
import { VenonBotDTO } from "../dto/venonBotDTO"
import { Injectable, Inject } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class InitializeVenonBot {
    public client: Whatsapp
    private to: string
    private body: any

    constructor() {
        this.init()
    } 

    async init() {
        const qr = (base64Qrimg: string) => { }
        const status = (statusSession: string) => { }
        const start = (client: Whatsapp) => {
            this.client = client
            client.onMessage(message => {
                console.log(message);

                this.scheduling(message)
            })
        }

        create('agendamentos')
            .then((client) => start(client))
            .catch((error) => console.error(error))
    }

    async scheduling(messageRecived: any) {
        try {
            console.log(messageRecived);
            
            if (messageRecived.from == "556295491075@c.us" || messageRecived.from == "556293312158@c.us" || messageRecived.from == "5562993312158@c.us" || messageRecived.from == "559492429276@c.us" || messageRecived.from == "559499803400@c.us" || messageRecived.from == "559499803400@c.us") {

                const { data } = await axios.post<any>(
                    'http://localhost:7070/message',
                    { user: messageRecived.from, message: messageRecived.body, nameClient: messageRecived.notifyName },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                        },
                    },
                );

                console.log(data);
                
                
                return data
            }
            else {
                return "ok"
            }
        }
        catch (error) {
            throw new Error(error);

        }
    }

    async sendMessage(sendMessage: VenonBotDTO) {
        if (sendMessage.type == "text") {
            return await this.sendText(sendMessage)
        } else if (sendMessage.type == "button") {
            return await this.sendButton(sendMessage)
        }
    }

    async sendText(body: VenonBotDTO) {
        try {
            return await this.client.sendText(body.to, body.body)
        }
        catch (error) {
            console.error("error in app, ", error);

            throw new Error(error)
        }
    }

    async sendButton(body: VenonBotDTO) {
        try {
            let button = [
                {
                    "buttonText": {
                        "displayText": body.opcoes.op1
                    }
                },
                {
                    "buttonText": {
                        "displayText": body.opcoes.op2
                    }
                }
            ]


            return await this.client.sendButtons(body.to, "Por Gentileza, Selecione Uma Opção: ", button, ' ')
                .then((result) => {
                    return console.log('Result: ', result);
                })
                .catch((erro) => {
                    return console.error('Error when sending: ', erro); 
                });
        }
        catch (error) {
            console.error("error in app, ", error);

            throw new Error(error)
        }
    }
}