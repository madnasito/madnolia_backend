import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Namespace, Socket } from "socket.io"
import { UserSocketGuard } from 'src/guards/user-sockets.guard';
import { MatchesService } from './matches.service';
import { Users } from 'src/messages/classes/user';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchDto } from './dtos/match.dto';

@WebSocketGateway()
export class MatchesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(MatchesGateway.name);

  constructor(
    private matchesService:MatchesService,
    private users:Users
  ){}

  
  @WebSocketServer() io: Namespace

  handleDisconnect(client: any) {
  }
  afterInit(server: any) {

  }
  handleConnection(client: any, ...args: any[]) {
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('match_created')
  async handleMatchCreated(client: Socket, payload: string) {

    this.logger.debug(client)
    this.logger.debug(payload)

    const match = await this.matchesService.getMatchWithGame(payload);

    this.logger.debug(match)

    if(!match) throw new WsException('Not found match')

    const matchUrl = `${process.env.URL}/match/info/${match._id}`

    // const user = this.users.getUser(client.id)

    const eventPayload = {
      match: match._id,
      img: match.game.background,
      name: match.title,
      url: matchUrl
    }
    

    match.inviteds.forEach(element => {
      const invitedUser = this.users.getUserById(element.toString())
      if(invitedUser){
        client.to(invitedUser.socketId).emit('invitation', eventPayload)
        this.logger.debug(invitedUser)
      }
    })

    
    // client.emit('invitation', eventPayload)
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('join_to_match')
  async handleJoinToMatch(client: Socket, payload: string) {

    try {

      this.logger.debug(`Client id: ${client.id} tries to join`);

      const user = this.users.getUser(client.id)
      this.logger.debug(user);
      const matchUpdated = await this.matchesService.addUserToMatch(payload, user._id)
      
      this.logger.debug(matchUpdated);
      
      if(!matchUpdated) {
        client.emit('added_to_match', false)
        throw new WsException(NotFoundException)
      }
      
      client.emit('added_to_match', true)
      
      const {_id, name, thumb, username} = user
      
      client.to(payload).emit('new_player_to_match', {
        _id, name, thumb, username
      })
      this.logger.debug(`Client id: ${client.id} joined to match`);

    } catch (error) {
      client.emit('added_to_match', false)
      throw new WsException(error)
    }

  }
  
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {

    try {
      this.logger.debug('Called every minute');
    const matches:any = await this.matchesService.updatePastTimeMatches() 
    
    matches.forEach((match:MatchDto) => {
      const payload = {
        title: match.title,
        match: match._id,
      }
      
      // Event to hoster
      const hoster = this.users.getUserById(match.user.toString())
      if(hoster) this.io.to(hoster.socketId).emit('match_ready', payload)

      // Event to joined users
      match.likes.forEach((user) => {
        
        const socketUser = this.users.getUserById(user.toString())
        if(socketUser){
          this.io.to(socketUser.socketId).emit('match_ready', payload)
          this.logger.debug(`Notification to ${socketUser.username}`)
        }
      })

    })
    } catch (error) {
      this.logger.debug(error)
      throw new WsException(error)
    }
    
  }
}
