import {
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsAlphanumeric()
  @IsOptional()
  name: string;

  @IsOptional()
  @Matches(/^[a-z0-9-_@]+$/, { message: 'Invalid username' })
  @MaxLength(20)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional()
  platforms: Array<number>;

  @IsString()
  @IsOptional()
  img: string;

  @IsString()
  @IsOptional()
  thumb: string;

  @IsInt()
  @IsOptional()
  @IsIn([0, 1, 2])
  availability: number;
}
