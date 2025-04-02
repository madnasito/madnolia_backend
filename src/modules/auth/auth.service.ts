import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dtio';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  signUp = async (signUpDto: SignUpDto) => {
    signUpDto.username = signUpDto.username.toLowerCase();
    const createdUser = await this.usersService.create(signUpDto);

    const payload = { id: createdUser._id };
    const token = await this.jwtService.signAsync(payload);
    return {
      user: createdUser,
      token,
    };
  };

  signIn = async (signInDto: SignInDto) => {
    const user = await this.usersService.fincOneByUsername(signInDto.username);

    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    const isMatch = await compare(signInDto.password, user.password);

    if (!isMatch) throw new BadRequestException('WRONG_PASSWORD');

    const payload = { id: user._id };
    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
    };
  };
}
