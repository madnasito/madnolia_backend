import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule.register({ secret: 'hard!to-guess_secret', signOptions: {expiresIn: "10d"} })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
