import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { User } from 'src/modules/users/schemas/user.schema';

export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(new Date().getTime())
  date: number;

  @IsOptional()
  @IsBoolean()
  private: boolean;

  @IsOptional()
  @IsArray()
  inviteds: User[];

  @IsOptional()
  @IsArray()
  joined: User[];
}
