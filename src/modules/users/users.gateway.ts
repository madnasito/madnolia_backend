import { UseGuards, Request, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { UsersService } from './users.service';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';
import { Socket } from 'socket.io';
import { ConnectionRequestService } from './connection-request/connection-request.service';
import { Types } from 'mongoose';

@WebSocketGateway()
export class UsersGateway {
  constructor(
    private readonly usersService: UsersService,
    private readonly connectionRequestService: ConnectionRequestService,
  ) {}

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('request_connection')
  async requestNewConnection(
    @MessageBody() requestedUser: string,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    const requested = await this.usersService.fincOneById(requestedUser);
    if (!requested) throw new WsException('USER_NOT_FOUND');
    const requestDb = await this.connectionRequestService.create(
      request.user,
      requested.id,
    );
    client.emit('new_request_connection', requestDb);
    return requestDb;
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('accept_connection')
  async acceptConnection(
    @MessageBody() sender: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    try {
      const connectionRequestDb =
        await this.connectionRequestService.acceptConnection(
          sender,
          request.user,
        );
      await this.usersService.addPartner(
        connectionRequestDb.receiver,
        connectionRequestDb.sender,
      );

      client.emit('connection_accepted', connectionRequestDb);
      return connectionRequestDb;
    } catch (error) {
      Logger.error(error);
      throw new WsException('NOT_FOUND_REQUEST_CONNECTION');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('reject_connection')
  async rejectConnection(
    @MessageBody() sender: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    try {
      const connectionRequestDb =
        await this.connectionRequestService.rejectConnection(
          sender,
          request.user,
        );

      client.emit('connection_rejected', connectionRequestDb);
      return connectionRequestDb;
    } catch (error) {
      Logger.error(error);
      throw new WsException('NOT_FOUND_REQUEST_CONNECTION');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('cancel_connection')
  async cancelConnection(
    @MessageBody() requestedId: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    try {
      const connectionRequestDb =
        await this.connectionRequestService.cancelConnection(
          request.user,
          requestedId,
        );

      client.emit('canceled_connection', connectionRequestDb);
      return connectionRequestDb;
    } catch (error) {
      Logger.error(error);
      throw new WsException('NOT_FOUND_REQUEST_CONNECTION');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('remove_partner')
  async removePartner(
    @MessageBody() userId: Types.ObjectId,
    @Request() request: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.usersService.removePartner(request.user, userId);
      client.emit('removed_partner', userId);
    } catch (error) {
      Logger.error(error);
      throw new WsException('ERROR_REMOVING_PARTNER');
    }
  }
}
