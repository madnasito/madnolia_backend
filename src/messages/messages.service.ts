import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/messages.schema';
import mongoose, { Model } from 'mongoose';
import { MessageDto } from './dtos/message.dto';

@Injectable()
export class MessagesService {
    
    constructor(@InjectModel(Message.name) private messageModel: Model<Message>){}
    
    create(createMessageDto: MessageDto) {
        const createdMessage = new this.messageModel(createMessageDto);
        return createdMessage.save();
    }

    getRoomMessages(room: string, skip: number = 0) {
        const limit = 30;
        return this.messageModel.find({room}, {}, {
            limit: limit,
            skip: skip * limit,
            populate: {path: 'user', select: '_id name username thumb'},
            sort: {_id: -1}
        });
    }

    update(id: string, text: string){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException()
        
        return this.messageModel.findByIdAndUpdate(id, {text}, {new: true})
    }

    delete(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException()

        return this.messageModel.findByIdAndDelete(id)
    }
}
