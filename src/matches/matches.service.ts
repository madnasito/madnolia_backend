import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './schemas/match.schema';
import mongoose, { Model } from 'mongoose';
import { GamesService } from 'src/games/games.service';
import { GameInterface } from './interfaces/game.interface';
import { CreateMatchDto } from './dtos/create-match.dto';
import { MatchDto } from './dtos/match.dto';
import { NewMatchDto } from './dtos/new-match.dto';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    private readonly gamesService: GamesService,
    private readonly messagesService: MessagesService,
  ) {}

  create = async (createMatchDto: CreateMatchDto, user: string) => {
    const gameData: GameInterface = await this.gamesService.getGame(
      createMatchDto.game,
    );

    console.log(gameData);
    const newMatch: NewMatchDto = {
      date: createMatchDto.date,
      game: gameData._id,
      inviteds: createMatchDto.inviteds,
      platform: createMatchDto.platform,
      title: createMatchDto.title,
      tournament: false,
      user: user,
    };

    const createdMatch = new this.matchModel(newMatch);

    const matchDb = await createdMatch.save();

    // await this.gamesService.increaseAmountInPlatform(gameData.gameId, createMatchDto.platform)

    return matchDb;
  };

  getMatch = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException();
    return this.matchModel.findById(id);
  };

  getMatchWithGame = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException();
    return this.matchModel.findOne(
      { _id: id },
      {},
      { populate: { path: 'game' } },
    );
  };

  getFullMatch = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException();

    const match = await this.matchModel.findOne(
      { _id: id },
      {},
      {
        populate: [
          { path: 'game' },
          { path: 'likes', select: '_id name thumb username' },
        ],
      },
    );

    if (!match) throw new NotFoundException();

    const messages = await this.messagesService.getRoomMessages(id);

    return { match, messages };
  };

  update = async (user: string, attrs: Partial<MatchDto>) => {
    const match = await this.matchModel.findOne({
      _id: attrs._id,
      user,
      active: true,
    });

    if (!match) throw new NotFoundException('Match not found');

    Object.assign(match, attrs);

    return match.save();
  };

  delete = async (id: string, user: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException();

    const matchDeleted = await this.matchModel.findOneAndUpdate(
      { _id: id, active: true, user },
      { active: false },
      { new: true },
    );

    if (!matchDeleted) throw new NotFoundException();

    return matchDeleted;
  };

  addUserToMatch = (id: string, user: string) => {
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(user)
    )
      throw new NotFoundException();

    return this.matchModel.findByIdAndUpdate(
      id,
      { $addToSet: { likes: user } },
      { new: true },
    );
  };

  getPlayerMatches = async (user: string, skip: number = 0) =>
    this.matchModel
      .find({ user }, {}, { populate: { path: 'game' } })
      .sort({ _id: -1 })
      .skip(skip);

  getPlayerInvitations = async (user: string, skip: number = 0) =>
    this.matchModel.find(
      { inviteds: user },
      {},
      { populate: { path: 'game' }, skip },
    );

  getMatchesByPlatform = async (platform: number, skip: number = 0) => {
    const results = await this.matchModel.aggregate([
      {
        $match: {
          platform,
          active: true,
        },
      },
      {
        $lookup: {
          from: 'games', // Assuming the collection for games is named 'games'
          localField: 'game',
          foreignField: '_id',
          as: 'gameDetails',
        },
      },
      {
        $unwind: '$gameDetails',
      },

      {
        $group: {
          _id: '$gameDetails._id', // Group by game ID
          count: { $sum: 1 },
          name: { $first: '$gameDetails.name' }, // Or any other field from Game
          background: { $first: '$gameDetails.background' }, // Include background property
          slug: { $first: '$gameDetails.slug' }, // Include slug property
        },
      },
      {
        $sort: {
          count: -1,
        },
        $skip: skip,
      },
    ]);
    return results;
  };

  getMatchesByGameAndPlatform = async (
    platform: number,
    game: string,
    skip: number = 0,
  ) => this.matchModel.find({ platform, game, active: true }, {}, { skip });

  updatePastTimeMatches = async (): Promise<Array<Match>> => {
    const matchesToUpdate = await this.matchModel.find({
      active: true,
      date: { $lt: new Date().getTime() },
    });
    await this.matchModel.updateMany(
      { date: { $lt: new Date().getTime() }, active: true },
      { active: false },
    );

    return matchesToUpdate;
  };

  async getLatestGamesByUserAndPlatform(
    user: string,
    platform: number,
  ): Promise<any> {
    const distinctGameIds = await this.matchModel
      .distinct('game', { platform, user })
      .exec();

    const games = await this.gamesService.getGamesInfo(distinctGameIds);

    return games;
  }
}
