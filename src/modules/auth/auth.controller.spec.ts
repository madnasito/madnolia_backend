import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dtos/user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;
  let fakeUserDto: UserDto;

  beforeEach(async () => {
    fakeAuthService = {
      // signIn: (signInDto: SignInDto) => {
      //   return Promise.resolve({
      //     user: {
      //       name: 'test',
      //       email: 'test@email.com',
      //       availability: Availability.EVERYONE,
      //       games: [],
      //       platforms: [15],
      //       img: '',
      //       partners: [],
      //       thumb: '',
      //       status: true,
      //       createdAt: new Date(),
      //       notifications: [],
      //       _id: '66edd051a38f7fecfbd2d178',
      //       username: signInDto.username,
      //     },
      //     token:
      //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWRkMDUxYTM4ZjdmZWNmYmQyZDE3OCIsImlhdCI6MTczNTMwMzk1OCwiZXhwIjoxNzM2MTY3OTU4fQ.9A7xq_uIDzGjM_kGuWc_U7WE2ydiwCbE64_W5WMPBNI',
      //   });
      // },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        JwtModule.register({
          secret: 'XDDD',
          signOptions: { expiresIn: '10d' },
        }),
      ],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
        { provide: UserDto, useValue: fakeUserDto },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
