import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor(
        private readonly gamesService: GamesService
    ){}

    @Get(':game')
    getGame(@Param('game') game: string) {
        return this.gamesService.findById(game);
    }
}
