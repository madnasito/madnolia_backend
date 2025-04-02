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
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
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

  @UseGuards(UserGuard)
  @Get('search/:username')
  async search(@Request() req: any, @Param('username') username: string) {
    return this.usersService.searchUser(req.user.id, username);
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
        validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1024 })],
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
      const apiKey = this.config.get<string>('IMGBB_KEY');

      form.append('file', new Blob([img.buffer], { type: img.mimetype }));
      form.append('apikey', apiKey);

      const resp = await axios.post(
        'https://beeimg.com/api/upload/file/json/',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Corrected Content-Type
          },
        },
      );

      if (
        resp.data.files.status === 'Success' ||
        resp.data.files.status === 'Duplicate'
      ) {
        await this.usersService.upadte(req.user.id, {
          thumb: resp.data.files.thumbnail_url,
          img: resp.data.files.url,
        });
        return {
          thumb: resp.data.files.thumbnail_url,
          img: resp.data.files.url,
        }; // Return a simple JSON response
      }

      throw new BadRequestException();
    } catch (error) {
      Logger.error(error);
      throw new BadGatewayException();
    }
  }
}
