import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { SignUpDto } from "./dtos/sign-up.dtio";
import { hash as bcryptHash, compare, genSalt } from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "./dtos/sign-in.dto";
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ){}

    signUp = async(signUpDto: SignUpDto) => {
        const emailDb = await this.findOneByEmail(signUpDto.email);

        if(emailDb){
            throw new BadRequestException('Email in use');
        }

        const userDb = await this.fincOneByUsername(signUpDto.username);
        if(userDb){
            throw new BadRequestException('Username in use');
        }

        const createdUser = new this.userModel(signUpDto);

        const saltOrRounds = 10;
        const password = signUpDto.password;
        const hash = await bcryptHash(password, saltOrRounds);
        const salt = await genSalt();

        createdUser.password = hash

        await createdUser.save()

        const payload = {user: createdUser._id}
        const token = await this.jwtService.signAsync(payload)
        return {
            user: createdUser,
            token
        }
    }

    signIn = async(signInDto: SignInDto) => {
        const user = await this.fincOneByUsername(signInDto.username);

        if(!user) throw new NotFoundException('Not found user');

        const isMatch = await compare(signInDto.password, user.password);

        if(!isMatch) throw new BadRequestException("Wrong password")

        const payload = {id: user._id};
        const token = await this.jwtService.signAsync(payload)

        return {
            user,
            token
        }
    }

    fincOneByUsername = async(username: string) => {
        const user = await this.userModel.findOne({username})
        return user;

    }

    findOneByEmail = async(email: string) => {
        const user = await this.userModel.findOne({email})
        return user;
    }

}