import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppVersionDocument = HydratedDocument<AppVersion>;

@Schema()
export class AppVersion {
  @Prop({ type: Number })
  minimum: number;
}

export const AppVersionSchema = SchemaFactory.createForClass(AppVersion);
