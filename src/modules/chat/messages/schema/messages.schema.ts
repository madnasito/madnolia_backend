import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { MessageType } from '../enums/message-type.enum';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  to: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
  })
  text: string;

  @Prop({
    default: new Date(),
  })
  date: Date;

  @Prop({ required: true })
  type: MessageType;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
