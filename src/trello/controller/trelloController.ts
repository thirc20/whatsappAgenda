import { Controller, Body, Post } from '@nestjs/common';
import { TrelloService } from '../business/trelloService';


@Controller('trello')
export class TrelloController{
    constructor(private trelloService: TrelloService){}

    @Post()
    async trello(@Body() client: any){
        return await this.trelloService.trelloManegerApi(client)
    }
}