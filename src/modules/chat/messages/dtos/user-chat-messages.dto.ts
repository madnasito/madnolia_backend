import { IsInt, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UserChatDto {
  @IsMongoId({ message: 'INVALID_USER' })
  user: Types.ObjectId;

  @IsOptional()
  @IsInt()
  skip: number;
}
