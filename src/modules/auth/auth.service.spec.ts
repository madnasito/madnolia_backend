import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { SignUpDto } from './dtos/sign-up.dtio';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { hashSync } from 'bcrypt';
// import { SignUpDto } from './dtos/sign-up.dtio';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];

  beforeEach(async () => {
    // Create a fake copy of the users service

    fakeUsersService = {
      findOneByEmail: async (email: string) => {
        const filteredUsers = users.find((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      fincOneByUsername: async (username: string) => {
        const foundUser = users.find((user) => user.username === username);
        return Promise.resolve(foundUser);
      },
      create: async (signUpDto: SignUpDto) => {
        signUpDto.password = hashSync(signUpDto.password, 10);
        const user = {
          _id: '676c6881fe631a19ed4dc0d4',
          ...signUpDto,
        } as unknown as User;
        users.push(user);
        return user;
      },

      // create: async (signUpDto: SignUpDto) => {
      //   const user: Partial<UserDto> = { ...signUpDto };
      //   user._id = '67695b82656bb14f02fff352';
      //   return user as UserDto;
      // },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
      imports: [
        JwtModule.register({
          secret: 'XDDD',
          signOptions: { expiresIn: '10d' },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('It can create an instance of auth server', () => {
    expect(service).toBeDefined();
  });

  it('Creates a new with a hashed password', async () => {
    const user = await service.signUp({
      name: 'test',
      email: 'test@email.com',
      password: '123456',
      platforms: [16],
      username: 'test',
    });
    expect(user.user.partners).not.toEqual('123456');

    const hash = user.user.password;
    expect(hash).toBeDefined();
  });

  // TODO: Move to users service spec VERIFY EMAIL
  it('It throws if signin is called with an unused username', async () => {
    await expect(
      service.signIn({ username: 'not_found', password: '1234' }),
    ).rejects.toThrow(NotFoundException);
  });

  // TODO: DO IT ON users.service.spec
  it('It throws if an invalid password is provided', async () => {
    await expect(
      service.signIn({ username: 'test', password: '12345' }),
    ).rejects.toThrow(BadRequestException);
  });
});
