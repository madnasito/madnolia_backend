import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Privacy } from '../enums/privacy.enum';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(25)
  name: string;

  @IsString()
  @MaxLength(100)
  description: string;

  @IsArray()
  members: string[];

  @IsEnum(Privacy)
  privacy: Privacy;

  @IsOptional()
  @IsString()
  @IsUrl()
  icon: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  banner: string;
}
