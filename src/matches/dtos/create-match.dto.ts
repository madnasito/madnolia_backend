import { IsArray, IsBoolean, IsInt, IsMongoId, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";


export class CreateMatchDto {
    @IsString()
    @MaxLength(40)
    title: string;

    @IsInt()
    platform: number;

    @IsInt()
    game: number;

    @IsNumber()
    @Min(new Date().getTime())
    date: number;

    @IsArray()
    inviteds: Array<string>

    @IsOptional()
    @IsBoolean()
    private: boolean

}