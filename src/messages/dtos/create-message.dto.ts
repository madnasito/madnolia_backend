
import { WsException } from "@nestjs/websockets";
import { IsMongoId, IsString } from "class-validator";

export class CreateMessageDto extends WsException {
    @IsMongoId()
    room: string;

    @IsString()
    text: string;

}

