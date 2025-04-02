import { IsMongoId } from 'class-validator';

export class GroupDto {
  @IsMongoId()
  group: string;
}
