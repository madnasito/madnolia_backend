import mongoose, { Model, Types } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import axios from 'axios';
import { SignUpDto } from '../auth/dtos/sign-up.dtio';
// import { ConnectionRequestStatus } from './connection-request/enums/connection-status.enum';
import { ConnectionRequestService } from './connection-request/connection-request.service';
import { ConnectionStatus } from './enums/connection-status.enum';
// import { SimpleUser } from './classes/simple-user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly connectionRequestService: ConnectionRequestService,
  ) {}

  create = async (signUpDto: SignUpDto): Promise<User> => {
    const emailDb = await this.findOneByEmail(signUpDto.email);

    if (emailDb) {
      throw new BadRequestException('EMAIL_IN_USE');
    }

    const userDb = await this.fincOneByUsername(signUpDto.username);
    if (userDb) {
      throw new BadRequestException('USERNAME_IN_USE');
    }

    const createdUser = new this.userModel(signUpDto);
    const saltOrRounds = 10;
    const password = signUpDto.password;
    const hash = hashSync(password, saltOrRounds);

    createdUser.password = hash;

    await createdUser.save();

    // Use toJSON method to convert _id to string
    return createdUser.toJSON();
  };

  fincOneByUsername = async (username: string) => {
    const user = await this.userModel.findOne({ username });
    return user;
  };

  findOneByEmail = async (email: string): Promise<User | null> => {
    const user = await this.userModel.findOne({ email });
    return user;
  };

  fincOneById = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('USER_NOT_FOUND');

    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    return user;
  };

  fincOneMinimalById = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('USER_NOT_FOUND');

    const user = await this.userModel.findById(id, {
      _id: 1,
      name: 1,
      username: 1,
      thumb: 1,
    });

    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    return user;
  };

  getInfo = async (user: Types.ObjectId) =>
    (await this.userModel.findOne({ _id: user, status: true })).toJSON();

  // getInvitations = async (user: string) => this.userModel.populate('')

  upadte = async (user: string, attrs: Partial<User>): Promise<User | null> =>
    this.userModel.findOneAndUpdate({ _id: user }, attrs, { new: true });

  userExists = async (username: string, email: string) => {
    const usernameDb = await this.userModel.findOne({ username });
    if (usernameDb) throw new ConflictException('USERNAME_IN_USE');
    const emailDb = await this.userModel.findOne({ email });
    if (emailDb) throw new ConflictException('EMAIL_IN_USE');
    return {};
  };

  async searchUser(
    userId: Types.ObjectId,
    query: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<any> {
    const regex = new RegExp(query, 'i');
    const skip = (page - 1) * limit;

    const userInfo = await this.userModel.findOne({ _id: userId });
    const partners = userInfo?.partners || [];

    const userRequests =
      await this.connectionRequestService.findRequestsByUser(userId);

    const requestsReceived = userRequests
      .filter((request) => request.receiver.equals(userInfo._id))
      .map((request) => request.sender);

    const requestsSended = userRequests
      .filter((request) => request.sender.equals(userInfo._id))
      .map((request) => request.receiver);

    const foundUsers = await this.userModel
      .find({
        $or: [{ username: regex }, { name: regex }],
        $nor: [{ _id: userId }],
        status: true,
      })
      .select({ name: 1, username: 1, _id: 1, thumb: 1 })
      .lean()
      .skip(skip)
      .limit(limit)
      .exec();

    const results = foundUsers.map((foundUser) => {
      const connectionUser: any = foundUser;
      connectionUser.connection = ConnectionStatus.NONE;

      if (
        partners.some((partnerId: Types.ObjectId) =>
          partnerId.equals(foundUser._id),
        )
      ) {
        connectionUser.connection = ConnectionStatus.PARTNER;
      } else if (
        requestsSended.some((senderId: Types.ObjectId) =>
          senderId.equals(foundUser._id),
        )
      ) {
        connectionUser.connection = ConnectionStatus.REQUEST_SENT;
      } else if (
        requestsReceived.some((receiverId: Types.ObjectId) =>
          receiverId.equals(foundUser._id),
        )
      ) {
        connectionUser.connection = ConnectionStatus.REQUEST_RECEIVED;
      }

      return connectionUser;
    });

    // Ordenar los resultados: partners primero
    results.sort((a, b) => {
      if (
        a.connection === ConnectionStatus.PARTNER &&
        b.connection !== ConnectionStatus.PARTNER
      ) {
        return -1; // 'a' va antes que 'b'
      } else if (
        a.connection !== ConnectionStatus.PARTNER &&
        b.connection === ConnectionStatus.PARTNER
      ) {
        return 1; // 'b' va antes que 'a'
      }
      return 0; // Mantener el orden relativo si ambos tienen el mismo estado
    });

    // Aplicar paginación después de ordenar
    return results.slice(skip, skip + limit);
  }

  resetNotifications = async (user: string) =>
    this.userModel.findOneAndUpdate(
      { _id: user },
      { notification: 0 },
      { new: true },
    );

  getUserPartners = async (user: string) => {
    return this.userModel
      .findOne(
        { _id: user },
        { partners: 1 }, // Select only the 'partners' field
        {
          populate: {
            path: 'partners',
            match: { status: true },
            select: 'name username img',
          },
        },
      )
      .select('partners'); // Ensure only 'partners' is returned
  };

  requestConnection = async (user: Types.ObjectId, partner: Types.ObjectId) => {
    try {
      const verifiedUser = await this.getInfo(user);
      const verifiedPartner = await this.getInfo(partner);

      if (!verifiedUser || !verifiedPartner)
        throw new NotFoundException('USER_NOT_FOUND');

      await this.userModel.findOneAndUpdate(
        { _id: partner },
        { $push: { connectionsRequests: user } },
      );
      return true;
    } catch (error) {
      Logger.error(error);
      throw new NotAcceptableException(error);
    }
  };

  addPartner = async (user: Types.ObjectId, partner: Types.ObjectId) => {
    try {
      const verifiedUser = await this.getInfo(user);
      const verifiedPartner = await this.getInfo(partner);

      if (!verifiedUser || !verifiedPartner) {
        throw new NotFoundException('USER_NOT_FOUND');
      }

      // Add partner to user's partners array if not already present
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user, partners: { $ne: partner } }, // $ne means "not equal"
        { $push: { partners: partner } },
        { new: true },
      );

      // Add user to partner's partners array if not already present
      await this.userModel.findOneAndUpdate(
        { _id: partner, partners: { $ne: user } },
        { $push: { partners: user } },
      );

      if (!updatedUser) {
        //If no update occured, it means the partner was already in user's partner list.
        return this.getInfo(user); //Return the user info.
      }
      return updatedUser;
    } catch (error) {
      Logger.error(error);
      throw new NotAcceptableException(error);
    }
  };
  removePartner = async (user: Types.ObjectId, partner: Types.ObjectId) => {
    try {
      const verifiedUser = await this.getInfo(user);
      const verifiedPartner = await this.getInfo(partner);

      if (!verifiedUser || !verifiedPartner) {
        throw new NotFoundException('USER_NOT_FOUND');
      }
      // Remove partner from user's partners array
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user },
        { $pull: { partners: partner } },
        { new: true },
      );

      // Remove user from partner's partners array
      await this.userModel.findOneAndUpdate(
        { _id: partner },
        { $pull: { partners: user } },
      );

      if (!updatedUser) {
        // If no update occurred, it means the partner was not in the user's partner list.
        return this.getInfo(user); // Return the user info.
      }
      return updatedUser;
    } catch (error) {
      Logger.error(error);
      throw new NotAcceptableException(error);
    }
  };

  uploadImage = async (form: FormData): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios
        .post('https://beeimg.com/api/upload/file/json/', form, {
          headers: {},
        })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  };
}
