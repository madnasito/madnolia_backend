import { Injectable, Scope } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable({ scope: Scope.DEFAULT })
export class Users {
  users: Array<User>;

  constructor(private usersService: UsersService) {
    this.users = [];
  }

  addUser = async (userId: string, socketId: string) => {
    const user = await this.usersService.fincOneById(userId);

    if (!user) {
      return;
    }

    const { name, username, thumb, _id } = user;

    this.users.push({ name, username, thumb, _id, socketId, room: '' });

    return this.users;
  };

  getUser = (id: string) =>
    this.users.filter((user) => user.socketId === id)[0];

  getUserById = (id: string) =>
    this.users.find((user) => user._id.toString() === id);

  getUserByUsername = (username: string) =>
    this.users.find((user) => user.username === username);

  getUsers = () => this.users;

  getUsersByRoom = (room: string) =>
    this.users.filter((user) => user.room === room);

  deleteUser = (id: string) => {
    const deletedUser = this.getUser(id);

    this.users = this.users.filter((user) => user.socketId != id);

    return deletedUser;
  };
}

interface User {
  name: string;
  username: string;
  thumb: string;
  _id: any;
  socketId: string;
  room: string;
}
