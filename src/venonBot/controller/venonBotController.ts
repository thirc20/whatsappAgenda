import { Body, Controller, Get, Post } from "@nestjs/common";
import { InitializeVenonBot } from "../business/venonBotService";
import { VenonBotDTO } from "../dto/venonBotDTO";


@Controller('venon')
export class VenonBotController {
    constructor(private venonService: InitializeVenonBot){}

    @Post()
    async sendMessage(@Body() msg: any){      
        try{
            return await this.venonService.sendMessage(msg)

        }  
        catch(error){
            throw new Error(error)
        }
    }
}
