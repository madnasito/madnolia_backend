import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { GamesModule } from 'src/modules/games/games.module';
import { MatchesGateway } from './matches.gateway';
import { MessagesModule } from 'src/modules/chat/messages/messages.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    GamesModule,
    MessagesModule,
    UsersModule,
  ],
  providers: [MatchesService, MatchesGateway],
  controllers: [MatchesController],
  exports: [],
})
export class MatchesModule {}
