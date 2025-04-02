import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AdminUserGroupDto {
  @IsNotEmpty()
  @IsMongoId()
  admin: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  group: string;
}
