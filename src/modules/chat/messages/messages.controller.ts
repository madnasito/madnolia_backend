import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Body,
  Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { UserChatDto } from './dtos/user-chat-messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('')
  @UseGuards(UserGuard)
  async getChats(@Request() req: any) {
    return this.messagesService.getUserChats(req.user.id);
  }

  @Get('match')
  async getMatchMessages(
    @Query('match') id: string,
    @Query('skip') skip: string,
  ) {
    return this.messagesService.getRoomMessages(id, parseInt(skip));
  }

  @Post('chat')
  @UseGuards(UserGuard)
  async getChatMessages(@Request() req: any, @Body() body: UserChatDto) {
    return this.messagesService.getUserChatMessages(
      req.user.id,
      body.user,
      body.skip,
    );
  }
}
