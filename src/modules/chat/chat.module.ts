import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { CallsModule } from './calls/calls.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MessagesModule, CallsModule, UsersModule],
  providers: [],
})
export class ChatModule {}
