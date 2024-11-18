import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Game } from 'src/games/schemas/game.schema';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: true,
  })
  status: boolean;

  @Prop({
    required: true,
  })
  platforms: Array<number>;

  @Prop({
    default: 'https://beeimg.com/images/w13588287183.jpg',
  })
  img: string;

  @Prop({
    default: 'https://i.beeimg.com/images/thumb/w13588287183-xs.jpg',
  })
  thumb: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  partners: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    default: [],
  })
  games: Game[];

  @Prop({ type: Number, default: 0 })
  notifications: number;

  // Availability 0 = Noone
  // Availability 1 = AnyOne
  // Availability 2 = Just partners
  @Prop({ type: Number, default: 1, enum: [0, 1, 2] })
  availability: number;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date })
  modifiedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
