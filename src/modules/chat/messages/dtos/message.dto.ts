import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { MessageType } from '../enums/message-type.enum';

export class MessageDto {
  @IsMongoId()
  to: string;

  @IsString()
  text: string;

  @IsMongoId()
  user: string;

  @IsEnum(MessageType)
  type: MessageType;
}
