import { Injectable } from "@nestjs/common";
import axios from "axios";
import { TrelloRepository } from "../model/trelloModel";

@Injectable()
export class TrelloService {
    constructor(private trelloModel: TrelloRepository){}
    
    async trelloManegerApi(client: any){
        let verifyCalendar:any = await this.verifyCalendarInDate(client)
        
        let turno = `${verifyCalendar.message[6]}${verifyCalendar.message[7]}${verifyCalendar.message[8]}${verifyCalendar.message[9]}-${verifyCalendar.message[3]}${verifyCalendar.message[4]}-${verifyCalendar.message[0]}${verifyCalendar.message[1]}T${client.turno}:00:00.000Z`

        let verifyDisponibility        

        if(client.turno == "Matutino"){
            client.turno = "12"
            turno = `${verifyCalendar.message[6]}${verifyCalendar.message[7]}${verifyCalendar.message[8]}${verifyCalendar.message[9]}-${verifyCalendar.message[3]}${verifyCalendar.message[4]}-${verifyCalendar.message[0]}${verifyCalendar.message[1]}T${client.turno}:00:00.000Z`

            verifyDisponibility = await this.verifyDisponibility('', turno)        
        }else if( client.turno == "Noturno" ){
            client.turno = "22"
            turno = `${verifyCalendar.message[6]}${verifyCalendar.message[7]}${verifyCalendar.message[8]}${verifyCalendar.message[9]}-${verifyCalendar.message[3]}${verifyCalendar.message[4]}-${verifyCalendar.message[0]}${verifyCalendar.message[1]}T${client.turno}:00:00.000Z`

            verifyDisponibility = await this.verifyDisponibility('', turno)       
        }

        for(let i = 0; i <= verifyDisponibility.length; i++){

            if(verifyDisponibility[i].due == turno){
                return "Não é possível marcar"
            }
            else{
                let newCardInfo = {fromName: client.fromName, due: turno, desc: '', clientUser: client.client}
                await this.createNewScheduling(newCardInfo)
                return this.trelloModel.endChat(client.client)
            }
        }

        let returnBody = {
            verifyCalendar: verifyCalendar,
            verifyDisponibility: verifyDisponibility
        }        

        return returnBody
    }

    async verifyCalendarInDate(client: any){
        let date = await this.trelloModel.findDate(client)
        if(date[1].message[2] == '/' && date[1].message[5] == '/' && date[1].message.length == 10){
            return date[1]
        } else return 'nada'
    }

    async verifyDisponibility(client:any, date:any){
        try{
            let trelloReturn:any = []
            const { data } = await axios.get<any>(
                `https://api.trello.com/1/lists/6306acf1097dfc00603e1b22/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
                {}
            ); 
            
            data.forEach((text, index) => {
                trelloReturn[index] = {
                    id: data[index].id,
                    name: data[index].name,
                    email: data[index].email,
                    desc: data[index].desc,
                    due: data[index].due,
                    idList: data[index].idList
                }
            });

            console.log("trello return ", trelloReturn);
        
            return trelloReturn
        }
        catch(error){
            console.error("Error: ", error);
        }
    }
    
    async createNewScheduling(cardClient: any){
        try{
            const { data } = await axios.post<any>(
                `https://api.trello.com/1/cards?idList=6306acf1097dfc00603e1b22&name=${cardClient.fromName}&desc=${cardClient.desc}&due=${cardClient.due}&pos=top&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
                {}
            );        
             if(data){
                const { data } = await axios.post<any>(
                    `${process.env.API_HOST}venon`,
                    { to: cardClient.clientUser, body: "Agendado! \nCaso precise de algo, estou a disposição!", type: "text", opcoes: {op1: "", op2: ""} },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                            },
                        },
                    );
             }
            
            return data
        }
        catch(error){
            console.error(error);
        }
    }

}