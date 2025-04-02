import {
  ArrayMinSize,
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsLowercase,
  IsStrongPassword,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Platform } from 'src/common/enums/platforms.enum';

export class CreateUserDto {
  @IsAlphanumeric()
  @MaxLength(17)
  name: string;

  @IsAlphanumeric()
  @IsLowercase()
  @Matches(/^[a-z0-9-_@]+$/)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  platforms: Array<Platform>;
}
