import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ConnectionRequestStatus } from '../enums/connection-status.enum';

export type ConnectionRequestDocument = HydratedDocument<ConnectionRequest>;

@Schema()
export class ConnectionRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  receiver: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: ConnectionRequestStatus,
    default: ConnectionRequestStatus.PENDING,
  })
  status: ConnectionRequestStatus;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const ConnectionRequestSchema =
  SchemaFactory.createForClass(ConnectionRequest);
