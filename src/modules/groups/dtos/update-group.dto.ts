import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Privacy } from '../enums/privacy.enum';

export class UpdateGroupDto {
  @IsMongoId()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(25)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  description: string;

  @IsOptional()
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
