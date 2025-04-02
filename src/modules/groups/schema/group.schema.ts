import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Privacy } from '../enums/privacy.enum';
import { JoinRequestApproval } from '../enums/join-request-approval.enum';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop({
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25,
    trim: true,
    match: /^[^\s][\s\S]*[^\s]$/,
  })
  name: string;

  @Prop({
    type: String,
    default: '',
    maxlength: 100,
    trim: true,
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  admin: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
    validate: [
      (value: any) => value.length <= 2000,
      'Array of members must not exceed 2000 items',
    ],
  })
  members: User[];

  @Prop({
    enum: Privacy,
    default: Privacy.PUBLIC,
  })
  privacy: Privacy;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
    validate: [
      (value: any) => value.length <= 500,
      'There are many requests for this group',
    ],
  })
  requests: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
    validate: [
      (value: any) => value.length <= 2000,
      'Array of banned users must not exceed 2000 items',
    ],
  })
  banned: User[];

  @Prop({
    type: String,
  })
  banner: string;

  @Prop({
    type: String,
  })
  icon: string;

  @Prop({
    enum: JoinRequestApproval,
    default: JoinRequestApproval.NO,
  })
  joinRequestApproval: JoinRequestApproval;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date })
  modifiedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
