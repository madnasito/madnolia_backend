import { Module } from '@nestjs/common';
import { CallsGateway } from './calls.gateway';
import { CallsService } from './calls.service';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  providers: [CallsGateway, CallsService],
  imports: [MessagesModule, UsersModule],
})
export class CallsModule {}
