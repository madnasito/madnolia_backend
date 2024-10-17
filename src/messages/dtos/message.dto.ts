import { IsMongoId, IsString } from "class-validator";

export class MessageDto {
    @IsMongoId()
    room: string;

    @IsString()
    text: string;

    @IsMongoId()
    user: string;
    
}