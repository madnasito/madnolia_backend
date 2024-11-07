import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateMatchDto } from './dtos/create-match.dto';
import { UserGuard } from 'src/guards/user.guard';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dtos/update-match.dto';

@Controller('match')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get('info/:id')
  async getMatch(@Param('id') id: string) {
    return this.matchesService.getMatch(id);
  }

  @Get('with-game/:id')
  async getMatchWithGame(@Param('id') id: string) {
    return this.matchesService.getMatchWithGame(id);
  }

  @Get('full/:id')
  async getFullMatch(@Param('id') id: string) {
    return this.matchesService.getFullMatch(id);
  }

  @UseGuards(UserGuard)
  @Get('player-matches')
  async getPlayerMatches(@Request() request: any) {
    return this.matchesService.getPlayerMatches(request.user.id);
  }

  @UseGuards(UserGuard)
  @Get('invitations')
  async getPlayerInvitations(@Request() request: any) {
    return this.matchesService.getPlayerInvitations(request.user.id);
  }

  @UseGuards(UserGuard)
  @Get('latest-games/:platform')
  async getLatestUserGames(
    @Request() request: any,
    @Param('platform') platform: string,
  ) {
    return this.matchesService.getLatestGamesByUserAndPlatform(
      request.user.id,
      parseInt(platform),
    );
  }

  @Get('platform/:platform')
  async getMatchesByPlatform(@Param('platform') platform: string) {
    return this.matchesService.getMatchesByPlatform(parseInt(platform));
  }

  @Get('by-platform-and-game/:platform/:game')
  async getMatchesByGameAndPlatform(
    @Param('platform') platform: string,
    @Param('game') game: string,
  ) {
    return this.matchesService.getMatchesByGameAndPlatform(
      parseInt(platform),
      game,
    );
  }

  @UseGuards(UserGuard)
  @Post('create')
  async create(@Request() req: any, @Body() body: CreateMatchDto) {
    return this.matchesService.create(body, req.user.id);
  }

  @UseGuards(UserGuard)
  @Put('update')
  update(@Request() req: any, @Body() body: UpdateMatchDto) {
    return this.matchesService.update(req.user.id, body);
  }

  @UseGuards(UserGuard)
  @Delete('delete/:id')
  delete(@Request() req: any, @Param('id') id: string) {
    return this.matchesService.delete(id, req.user.id);
  }
}
