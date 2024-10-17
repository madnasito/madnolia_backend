import { IsArray, IsBoolean, IsDefined, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NewMatchDto {

    
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsDefined()
    @IsMongoId()
    user: string

    @IsInt()
    platform: number;

    @IsMongoId()
    game: string;

    @IsNumber()
    date: number;

    @IsArray()
    inviteds: Array<string>

    @IsBoolean()
    tournament: boolean
}