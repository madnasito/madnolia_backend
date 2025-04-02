import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UserGroupDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  group: string;
}
