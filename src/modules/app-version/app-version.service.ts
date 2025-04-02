import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AppVersion } from './schemas/app-version.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppVersionService {
  constructor(
    @InjectModel(AppVersion.name) private appVersionModel: Model<AppVersion>,
  ) {}

  async getMinimumVersion() {
    return this.appVersionModel.findOne().exec();
  }
}
