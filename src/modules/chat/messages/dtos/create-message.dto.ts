import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { MessageType } from '../enums/message-type.enum';

export class CreateMessageDto {
  @IsMongoId()
  to: string;

  @IsString()
  text: string;

  @IsEnum(MessageType)
  type: MessageType;
}
