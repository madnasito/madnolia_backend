import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Body,
  UseInterceptors,
  Post,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpException,
  HttpStatus,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserGuard } from 'src/guards/user.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(
    private usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Get('search/:username')
  async search(@Param('username') username: string) {
    return this.usersService.searchUser(username);
  }

  @Get('user-exists/:username/:email')
  async userExists(
    @Param('username') username: string,
    @Param('email') email: string,
  ) {
    return this.usersService.userExists(username, email);
  }

  @Get('info')
  @UseGuards(UserGuard)
  async getInfo(@Request() req: any) {
    return this.usersService.getInfo(req.user.id);
  }

  @Get('reset-notifications')
  @UseGuards(UserGuard)
  async resetNotifications(@Request() req: any) {
    return this.usersService.resetNotifications(req.user.id);
  }

  @Get('user-partners')
  @UseGuards(UserGuard)
  async userPartners(@Request() req: any) {
    return this.usersService.getUserPartners(req.user.id);
  }

  @Put('update')
  @UseGuards(UserGuard)
  async update(@Request() req: any, @Body() body: UpdateUserDto) {
    return this.usersService.upadte(req.user.id, body);
  }

  @Post('update-img')
  @UseGuards(UserGuard)
  @UseInterceptors(FileInterceptor('img'))
  async uploadFile(
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 }), // 2MB max size
        ],
      }),
    )
    img: Express.Multer.File,
  ) {
    try {
      const validExtension = ['jpg', 'jpeg', 'png'];
      const extension = img.mimetype.split('/')[1];
      if (!validExtension.includes(extension)) {
        throw new HttpException('NOT_VALID_EXTENSION', HttpStatus.BAD_REQUEST);
      }

      const form = new FormData();
      form.append('file', new Blob([img.buffer], { type: img.mimetype }));
      form.append('apikey', 'a639124c1b9448e386cdf89e3fa4597f');

      return axios
        .post('https://beeimg.com/api/upload/file/json/', form, {
          headers: {
            'Content-Type':
              'multipart/form-data; boundary=<calculated when request is sent>',
          },
        })
        .then((resp) => {
          console.log(resp);
          if (
            resp.data.files.status == 'Success' ||
            resp.data.files.status == 'Duplicate'
          ) {
            return this.usersService.upadte(req.user.id, {
              thumb: resp.data.files.thumbnail_url,
              img: resp.data.files.url,
            });
          }
          throw new BadRequestException();
        })
        .catch((err) => {
          console.log(err);
          throw new BadGatewayException(err);
        });
    } catch (error) {
      throw new error();
    }
  }
}
