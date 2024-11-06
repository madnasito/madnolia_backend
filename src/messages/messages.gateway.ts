import {  Logger, Request,  UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import {  Namespace,  Socket } from "socket.io";
import { UserSocketGuard } from 'src/guards/user-sockets.guard';
import { UserGuard } from 'src/guards/user.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageDto } from './dtos/message.dto';
import { Users } from './classes/user';
import { JwtService } from '@nestjs/jwt';

  @UsePipes(new ValidationPipe())
@WebSocketGateway({
  // namespace: 'messages'
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(MessagesGateway.name);
  
  constructor(
    private readonly messagesService:MessagesService,
    private readonly jwtService:JwtService,
    private users:Users
  ){}

  @WebSocketServer() io: Namespace

  
  afterInit(@ConnectedSocket() socket: Socket) {
    this.logger.log("Initialized");
  }

  @UseGuards(UserGuard)
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { size } = this.io.sockets;

      const { token } = client.handshake.headers


      if (token === undefined || token === null || token === "") {
        client.disconnect(true)
        throw new WsException('Missing authentication token');
      }

      const tokenPayload = await this.jwtService.verifyAsync(token as string)
      await this.users.addUser(tokenPayload.id, client.id)

      this.logger.debug(`Client id: ${client.id} connected`);
      this.logger.debug(`Number of connected clients: ${size}`);

    } catch (error) {
      return new WsException(error)
    }
    
  }

  handleDisconnect(client: any) {
    this.users.deleteUser(client.id)
    this.logger.debug(`Cliend id:${client.id} disconnected`);
  }


  @UseGuards(UserSocketGuard)
  @SubscribeMessage('init_chat')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client:Socket) {

    try {
      this.users.getUser(client.id).room = data
      client.join(data)
      return true;
    } catch (error) {
      throw new WsException(error)
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('message')
  async handleMessage(@Request() request:any, @MessageBody() payload: CreateMessageDto, @ConnectedSocket() client:Socket) {
    try {
      
      this.logger.log(`Message received from client id: ${client.id}`);
      this.logger.debug(`Payload: ${payload}`);
    
      const message:MessageDto = {
        to: payload.to,
        user: request.user,
        text: payload.text
      }

      const messageSaved = await this.messagesService.create(message)
      if(!messageSaved) throw new WsException("No message")
  
      const { text, _id, date} = messageSaved
      const user = this.users.getUserById(request.user)

      const payloadEvent = {
        _id,
        text,
        date,
        to: payload.to,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          thumb: user.thumb
        }
      }

      
      this.logger.debug(`${this.users.getUser(client.id).room}`)

      client.to(payload.to).emit('message', payloadEvent)
      client.emit('message', payloadEvent)
    } catch (error) {
      console.log(error);
      throw new WsException(error)
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('disconnect_chat')
  handleDisconnectChat( @ConnectedSocket() client:Socket) {

    try {
      this.logger.debug(`Leaved the room: ${client.id}`);
      this.users.getUser(client.id).room = ""
      return true;
    } catch (error) {
      console.log(error);
      throw new WsException(error)
    }
  }
  
}

