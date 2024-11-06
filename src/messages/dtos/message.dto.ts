import { IsMongoId, IsString } from "class-validator";

export class MessageDto {
    @IsMongoId()
    to: string;

    @IsString()
    text: string;

    @IsMongoId()
    user: string;
    
}