import mongoose, { Model } from 'mongoose';
import { BadGatewayException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import axios from 'axios';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    fincOneByUsername = async(username: string) => {
        const user = await this.userModel.findOne({username})
        return user;
    }

    findOneByEmail = async(email: string) => {
        const user = await this.userModel.findOne({email})
        return user;
    }

    fincOneById = async(id: string) => {
      if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException()

      const user = await this.userModel.findById(id)

      if(!user) throw new NotFoundException()

      return user;
    }

    getInfo = async(user: string) => await this.userModel.findOne({_id: user, status: true})

    // getInvitations = async (user: string) => this.userModel.populate('')

    upadte = async (user: string, attrs: Partial<User>) => this.userModel.findOneAndUpdate({_id: user}, attrs, {new: true});

    userExists = async(username: string, email: string) => {
      const usernameDb = await this.userModel.findOne({username})
      if (usernameDb) throw new ConflictException("Username taked")
      const emailDb = await this.userModel.findOne({email})
      if (emailDb) throw new ConflictException("Email taked")
      return {}
    }

    searchUser = async (username: string) => {
        let regex = new RegExp(username, 'i')

        return await this.userModel.find({username: regex, status: true},
            {name: 1, username: 1, _id: 1, thumb: 1}, {limit: 5})
    }

    resetNotifications = async (user: string) => this.userModel.findOneAndUpdate({_id: user}, {notification: 0}, {new: true})
    
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
            }
          )
          .select('partners'); // Ensure only 'partners' is returned
      };
    
    addPartner = async (user: string, partner: string) => {
        const verifiedUser = await this.getInfo(partner);

        if(!verifiedUser) throw new NotFoundException()

        return this.userModel.findOneAndUpdate({_id: user}, {$push: {partners: partner}}, {new: true})
    }

    uploadImage = async(form:FormData):Promise<any> => {
      return new Promise((resolve, reject ) =>{
        axios.post('https://beeimg.com/api/upload/file/json/',
          form
          , {
              headers:
                  {
                      
                  }
          }).then((resp) => resolve(resp))
            .catch((err) => reject(err))
      })
    }
}