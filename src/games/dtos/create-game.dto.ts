import { IsArray, IsInt, IsString } from "class-validator";

export class CreateGameDto {

    @IsInt()
    gameId: number;

    @IsString()
    name: string;

    @IsArray()
    platforms: gamePlatform[]

    @IsString()
    background: string;

    @IsArray()
    screenshots: Array<string>

    @IsString()
    description: string;
}

interface gamePlatform {
    id: number,
    amount: number
}