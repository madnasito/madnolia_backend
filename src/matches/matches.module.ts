import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { GamesModule } from 'src/games/games.module';
import { MatchesGateway } from './matches.gateway';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
        GamesModule,
        MessagesModule
    ],
    providers: [MatchesService, MatchesGateway],
    controllers: [MatchesController],
    exports: []
})
export class MatchesModule {}
