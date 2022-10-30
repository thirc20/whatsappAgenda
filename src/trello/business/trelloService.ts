import { Injectable } from "@nestjs/common";
import axios from "axios";
import { TrelloRepository } from "../model/trelloModel";

@Injectable()
export class TrelloService {
    constructor(private trelloModel: TrelloRepository){}
    
    async trelloManegerApi(client: any){
        let verifyCalendar:any = await this.verifyCalendarInDate(client)
        
        let turno = `${verifyCalendar.message[6]}${verifyCalendar.message[7]}${verifyCalendar.message[8]}${verifyCalendar.message[9]}-${verifyCalendar.message[3]}${verifyCalendar.message[4]}-${verifyCalendar.message[0]}${verifyCalendar.message[1]}T${client.turno}:00:00.000Z`

        // let matutino = `${verifyCalendar.message[0]}${verifyCalendar.message[1]}/${verifyCalendar.message[3]}${verifyCalendar.message[4]}/${verifyCalendar.message[6]}${verifyCalendar.message[7]}${verifyCalendar.message[8]}${verifyCalendar.message[9]} 09:00`
        // let noturno = `${verifyCalendar.message[0]}${verifyCalendar.message[1]}/${verifyCalendar.message[3]}${verifyCalendar.message[4]}/${verifyCalendar.message[6]}${verifyCalendar.message[7]}${verifyCalendar.message[8]}${verifyCalendar.message[9]} 19:00`
        
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
                'https://api.trello.com/1/lists/6306acf1097dfc00603e1b22/cards?key=7cf43dad2facbf4abedf10c351a91f44&token=4dacf4360465fcd7c4f02d07297d21026fd8eacfef387e152b4d9a9667f008ee',
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

            return trelloReturn
        }
        catch(error){
            console.error("Error: ", error);
        }
    }
    
    async createNewScheduling(cardClient: any){
        try{
            const { data } = await axios.post<any>(
                `https://api.trello.com/1/cards?idList=6306acf1097dfc00603e1b22&name=${cardClient.fromName}&desc=${cardClient.desc}&due=${cardClient.due}&pos=top&key=7cf43dad2facbf4abedf10c351a91f44&token=4dacf4360465fcd7c4f02d07297d21026fd8eacfef387e152b4d9a9667f008ee`,
                {}
            );        
             if(data){
                const { data } = await axios.post<any>(
                    'http://localhost:7070/venon',
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