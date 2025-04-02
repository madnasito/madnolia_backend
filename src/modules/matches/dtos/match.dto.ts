import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class MatchDto {
  @IsOptional()
  @IsMongoId()
  _id: ObjectId;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDefined()
  @IsMongoId()
  user: string;

  @IsInt()
  platform: number;

  @IsMongoId()
  game: string;

  @IsNumber()
  date: number;

  @IsArray()
  inviteds: Array<string>;

  @IsArray()
  joined: Array<string>;

  @IsBoolean()
  tournament: boolean;
}
