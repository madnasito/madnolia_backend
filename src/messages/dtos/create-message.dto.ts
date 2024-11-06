
import { WsException } from "@nestjs/websockets";
import { IsMongoId, IsString } from "class-validator";

export class CreateMessageDto extends WsException {
    @IsMongoId()
    to: string;

    @IsString()
    text: string;

}

