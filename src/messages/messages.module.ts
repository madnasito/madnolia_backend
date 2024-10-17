import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/messages.schema';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Users } from './classes/user';
import { MessagesController } from './messages.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}]),
    UsersModule,
    JwtModule.register({ secret: 'hard!to-guess_secret', signOptions: {expiresIn: "10d"} })
  ],
  providers: [MessagesService, MessagesGateway, Users],
  exports: [Users, MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {}
