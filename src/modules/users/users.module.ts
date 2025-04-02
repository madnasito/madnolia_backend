import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UserGuard } from '../../common/guards/user.guard';
import { UsersGateway } from './users.gateway';
import { Users } from './classes/user';
import { ConnectionRequestModule } from './connection-request/connection-request.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConnectionRequestModule,
  ],
  controllers: [UserController],
  providers: [UsersService, UserGuard, UsersGateway, Users],
  exports: [UserGuard, UsersService, Users],
})
export class UsersModule {}
