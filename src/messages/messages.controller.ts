import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService:MessagesService){}

    @Get('match')
    async getMatchMessages(@Query('match') id: string, @Query('skip') skip: string){
        return this.messagesService.getRoomMessages(id,parseInt(skip));
    }
}
