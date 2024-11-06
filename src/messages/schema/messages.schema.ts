import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true
    })
    to: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    user: User

    @Prop({
        required: true
    })
    text: string

    @Prop({
        default: new Date()
    })
    date: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message)