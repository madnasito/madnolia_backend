import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/messages.schema';
import mongoose, { Model, Types } from 'mongoose';
import { MessageDto } from './dtos/message.dto';
import { MessageType } from './enums/message-type.enum';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly usersService: UsersService,
  ) {}

  create(createMessageDto: MessageDto) {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  getRoomMessages(room: string, skip: number = 0) {
    const limit = 30;
    return this.messageModel.find(
      { to: room },
      {},
      {
        limit: limit,
        skip: skip,
        populate: { path: 'user', select: '_id name username thumb' },
        sort: { _id: -1 },
      },
    );
  }

  async getUserChats(userId: Types.ObjectId): Promise<any[]> {
    try {
      const allMessages = await this.messageModel
        .find({
          $or: [
            { user: userId, type: MessageType.USER },
            { to: userId, type: MessageType.USER },
          ],
        })
        .sort({ date: -1 })
        // .populate('user', '_id name username thumb')
        .populate('to', '_id name username thumb')
        .exec();

      const chatUsers = new Map<string, any>();

      allMessages.forEach((message) => {
        const otherUserId = message.user.equals(userId)
          ? message.to._id.toString()
          : message.user._id.toString();

        if (!chatUsers.has(otherUserId)) {
          const otherUser = message.user.equals(userId)
            ? message.to
            : message.user;
          chatUsers.set(otherUserId, {
            user: otherUser,
            lastMessage: message,
          });
        }
      });

      const chats = Array.from(chatUsers.values()).map((chat) => ({
        user: chat.user,
        lastMessage: chat.lastMessage,
      }));

      // Ensure the 'user' in the chat is always the other user and populate it
      const finalChats = await Promise.all(
        chats.map(async (chat) => {
          const otherUser = chat.user._id.equals(userId)
            ? chat.lastMessage.user._id.equals(userId)
              ? chat.lastMessage.to
              : chat.lastMessage.user
            : chat.user;

          const populatedUser = await this.usersService.fincOneMinimalById(
            otherUser._id,
          );

          return {
            user: populatedUser,
            lastMessage: chat.lastMessage,
          };
        }),
      );

      return finalChats;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  getUserChatMessages(
    user1: Types.ObjectId,
    user2: Types.ObjectId,
    skip: number = 0,
  ) {
    return this.messageModel.find(
      {
        $or: [
          { user: user1, to: user2 },
          { user: user2, to: user1 },
        ],
      },
      {},
      {
        limit: 30,
        skip: skip,
        sort: { _id: -1 },
      },
    );
  }

  update(id: string, text: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    return this.messageModel.findByIdAndUpdate(id, { text }, { new: true });
  }

  delete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    return this.messageModel.findByIdAndDelete(id);
  }
}
