import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Users } from '../../users/classes/user';

@WebSocketGateway()
export class CallsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  connectedUsers: { [userId: string]: string[] } = {}; // Map user IDs to their connected room IDs

  constructor(private readonly users: Users) {}

  handleConnection(socket: Socket) {
    console.log(`${socket.id} Connected to calls`);
    console.log(this.users.getUsers());
  }

  @SubscribeMessage('join_call_room')
  handleJoinRoom(client: Socket, payload: { callRoom: string }) {
    client.join(payload.callRoom);
    this.addUserToRoom(payload.callRoom, client.id);
    const user = this.users.getUser(client.id);
    console.log(`Client ${user.username} joined room ${payload.callRoom}`);
  }

  @SubscribeMessage('leave_call_room')
  handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    this.removeUserFromRoom(roomId, client.id);
    console.log(`Client ${client.id} left room ${roomId}`);
  }

  @SubscribeMessage('make_room_call')
  handleMakeRoomCall(
    client: Socket,
    data: { calleeId: string; sdpOffer: any },
  ) {
    const { calleeId, sdpOffer } = data;
    const calleeRooms = this.connectedUsers[calleeId] || [];

    // Send offer to all connected rooms of the callee
    for (const roomId in calleeRooms) {
      client
        .to(roomId)
        .emit('new_room_call', { calleeId: client.id, sdpOffer });
    }
  }

  @SubscribeMessage('answer_room_call')
  handleAnswerRoomCall(
    client: Socket,
    data: { callerId: string; sdpAnswer: any },
  ) {
    const { callerId, sdpAnswer } = data;
    const callerRooms = this.connectedUsers[callerId] || [];

    // Send answer to all connected rooms to the caller
    for (const roomId of callerRooms) {
      client
        .to(roomId)
        .emit('room_call_answered', { callee: client.id, sdpAnswer });
    }
  }

  @SubscribeMessage('room_ice_candidate')
  handleRoomIceCandidate(
    client: Socket,
    data: { calleeId: string; iceCandidate: any },
  ) {
    const { calleeId, iceCandidate } = data;
    const calleeRooms = this.connectedUsers[calleeId] || [];

    // Send ice candidate to all connected rooms of the callee
    for (const roomId of calleeRooms) {
      client
        .to(roomId)
        .emit('room_ice_candidate', { sender: client.id, iceCandidate });
    }
  }

  @SubscribeMessage('make_call')
  handleMakeCall(
    socket: Socket,
    data: { callee_id: string; sdp_offer: string },
  ) {
    const { callee_id, sdp_offer } = data;

    const user = this.users.getUserByUsername(callee_id);

    this.server.to(user.socketId).emit('new_call', {
      caller_id: socket.id,
      sdp_offer: sdp_offer,
    });
  }

  @SubscribeMessage('answer_call')
  handleAnswerCall(
    socket: Socket,
    data: { caller_id: string; sdp_answer: any },
  ) {
    const { caller_id, sdp_answer } = data;

    this.server.to(caller_id).emit('call_answered', {
      callee: socket.id,
      sdpAnswer: sdp_answer,
    });
  }

  @SubscribeMessage('ice_candidate')
  handleIceCandidate(
    socket: Socket,
    data: { calleeId: string; iceCandidate: any },
  ) {
    const { calleeId, iceCandidate } = data;
    const user = this.users.getUserByUsername(calleeId);
    this.server.to(user ? user.socketId : calleeId).emit('ice_candidate', {
      sender: socket.id,
      iceCandidate: iceCandidate,
    });
  }

  private addUserToRoom(roomId: string, userId: string) {
    if (!this.connectedUsers[userId]) {
      this.connectedUsers[userId] = [];
    }
    this.connectedUsers[userId].push(roomId);
  }

  private removeUserFromRoom(roomId: string, userId: string) {
    const userRooms = this.connectedUsers[userId] || [];
    const index = userRooms.indexOf(roomId);
    if (index !== -1) {
      userRooms.splice(index, 1);
    }
  }
}
