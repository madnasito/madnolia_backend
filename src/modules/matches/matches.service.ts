import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './schemas/match.schema';
import mongoose, { Model } from 'mongoose';
import { GamesService } from 'src/modules/games/games.service';
import { GameInterface } from './interfaces/game.interface';
import { CreateMatchDto } from './dtos/create-match.dto';
import { NewMatchDto } from './dtos/new-match.dto';
import { MessagesService } from 'src/modules/chat/messages/messages.service';
import { MatchStatus } from './enums/status.enum';
import { UpdateMatchDto } from './dtos/update-match.dto';

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

    const newMatch: NewMatchDto = {
      date: createMatchDto.date,
      game: gameData._id,
      inviteds: createMatchDto.inviteds,
      platform: createMatchDto.platform,
      title: createMatchDto.title != '' ? createMatchDto.title : 'Casual',
      tournament: false,
      description: createMatchDto.description,
      user: user,
      group: createMatchDto.group,
      duration: createMatchDto.duration,
    };

    const createdMatch = new this.matchModel(newMatch);

    const matchDb = await createdMatch.save();

    // await this.gamesService.increaseAmountInPlatform(gameData.gameId, createMatchDto.platform)

    return matchDb;
  };

  getMatch = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');
    return this.matchModel.findById(id);
  };

  getMatchWithGame = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ConflictException('NO_GAME_FOUND');
    return this.matchModel.findOne(
      { _id: id },
      {},
      { populate: { path: 'game' } },
    );
  };

  getFullMatch = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    const match = await this.matchModel.findOne(
      { _id: id },
      {},
      {
        populate: [
          { path: 'game' },
          { path: 'joined', select: '_id name thumb username' },
          { path: 'user', select: '_id name thumb username' },
        ],
      },
    );

    if (!match) throw new NotFoundException();

    const messages = await this.messagesService.getRoomMessages(id);

    return { match, messages };
  };

  update = async (id: string, user: string, attrs: Partial<UpdateMatchDto>) => {
    const match = await this.matchModel.findOneAndUpdate(
      {
        _id: id,
        user,
        status: { $nin: [MatchStatus.FINISHED, MatchStatus.CANCELLED] },
      },
      attrs,
      { new: true }, // Return the updated document
    );

    if (!match) {
      throw new NotFoundException('NO_MATCH_FOUND');
    }

    return match;
  };

  delete = async (id: string, user: string) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    const matchDeleted = await this.matchModel.findOneAndUpdate(
      { _id: id, user },
      { status: MatchStatus.CANCELLED },
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
      throw new NotFoundException('USER_NOT_FOUND');

    return this.matchModel.findByIdAndUpdate(
      id,
      { $addToSet: { joined: user } },
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
          status: { $ne: MatchStatus.FINISHED },
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
      },
      {
        $skip: skip, // Move this out of the $sort stage
      },
    ]);

    return results;
  };

  getMatchesWithUserJoined = (userId: string): Promise<Match[]> =>
    this.matchModel.find(
      { joined: userId },
      {},
      { populate: { path: 'game' }, sort: { _id: -1 } },
    );

  getMatchesByGameAndPlatform = async (
    platform: number,
    game: string,
    skip: number = 0,
  ) =>
    this.matchModel.find(
      { platform, game, status: { $ne: MatchStatus.FINISHED } },
      {},
      { skip, sort: { date: 1 } },
    );

  updatePastTimeMatches = async (): Promise<Array<Match>> => {
    const currentTimeMillis = new Date().getTime();

    const matches = await this.matchModel.find({
      status: MatchStatus.WAITING,
      date: { $lt: new Date().getTime() },
    });

    await this.matchModel.updateMany(
      {
        status: MatchStatus.WAITING,
        date: { $lt: new Date().getTime() },
      },
      { status: MatchStatus.RUNNING },
    );

    await this.matchModel.updateMany(
      {
        $expr: {
          $lt: [
            {
              $add: ['$date', { $multiply: ['$duration', 60000] }],
            },
            currentTimeMillis,
          ],
        },
      },
      { status: MatchStatus.FINISHED },
    );

    return matches;
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
