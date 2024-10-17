import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/game.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RawgGame } from './interfaces/rawg-game.interface';

@Injectable()
export class GamesService {

    constructor(
        @InjectModel(Game.name) private gameModel: Model<Game>,
        private config: ConfigService,
        private readonly httpService: HttpService
    ){}

    getGame = async(id: number) => {

        const gameDb = await this.findByRawId(id);

        if(gameDb) return gameDb;

        const rawGame:RawgGame = await this.getRawgGame(id)

        const newGame = {
            name: rawGame.name,
            slug: rawGame.slug,
            gameId: rawGame.id,
            platforms: [],
            background: rawGame.background_image,
            screenshots: [],
            description: rawGame.description_raw
        }

        const createdGame = new this.gameModel(newGame)

        return await createdGame.save();

    }

    // increaseAmountInPlatform = async (gameId: number, platform: number) => {

    //     const gameDb = await this.gameModel.findOneAndUpdate({ gameId, platforms: { $elemMatch: { id: Number(platform) } } }, {
    //         $inc: {
    //             "platforms.$.amount": 1
    //         }
    //     }, { new: true })

    //     if (gameDb) return gameDb

    //     return await this.gameModel.findOneAndUpdate({ gameId }, {
    //         $push: {
    //             platforms: {
    //                 id: platform,
    //                 amount: 1
    //             }
    //         }
    //     }, { new: true }).catch((err) => new BadGatewayException())
        
        
    // }

    findByRawId = async(gameId: number):Promise<any> => await this.gameModel.findOne({gameId})

    async findById (gameId: string):Promise<any> {
        const gameDb = await this.gameModel.findById(gameId)

        if(!gameDb) throw new NotFoundException()

        return gameDb;
    } 

    getRawgGame = async(id: number) => {
        const apiKey = this.config.get<string>('RAWG_API_KEY')
        const gameData = (await this.httpService.axiosRef.get(`/${id}?key=${apiKey}`)).data
        return gameData
    }
}
