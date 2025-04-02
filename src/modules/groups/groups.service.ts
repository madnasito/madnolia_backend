import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dtos/create-group.dto';
import { JoinRequestApproval } from './enums/join-request-approval.enum';
import { UserGroupDto } from './dtos/user-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    private readonly usersService: UsersService,
  ) {}

  create(createGroupDto: CreateGroupDto, user: string) {
    createGroupDto.members.push(user);

    const createdGroup = new this.groupModel({
      ...createGroupDto,
      admin: user,
    });

    return createdGroup.save();
  }

  getGroupInfo = async (id: string) => {
    const group = await this.groupModel.findOne({ _id: id });

    if (!group) throw new NotFoundException('NO_GROUP');

    return group;
  };

  update = async (user: string, body: UpdateGroupDto) => {
    const groupDb = await this.groupModel.findOne({ _id: body.id });

    if (!groupDb) throw new NotFoundException('NO_GROUP');

    if (groupDb.admin.toString() != user) throw new UnauthorizedException();

    return this.groupModel.findOneAndUpdate(
      {
        _id: body.id,
      },
      { ...body, modifiedAt: new Date() },
      { new: true },
    );
  };

  addMember = async (userGroupDto: UserGroupDto, member: string) => {
    const groupDb = await this.groupModel.findOne({
      _id: userGroupDto.group,
      $or: [{ admin: member }, { members: member }],
      members: { $ne: userGroupDto.user },
      banned: { $ne: userGroupDto.user },
    });

    if (!groupDb) throw new NotFoundException('GROUP_NOT_FOUND');

    await this.usersService.fincOneById(userGroupDto.user);

    if (
      groupDb.joinRequestApproval == JoinRequestApproval.ADMIN &&
      groupDb.admin.toString() != member
    ) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    if (
      groupDb.admin.toString() == member ||
      groupDb.joinRequestApproval == JoinRequestApproval.MEMBERS ||
      groupDb.joinRequestApproval == JoinRequestApproval.NO
    ) {
      return this.groupModel.findOneAndUpdate(
        { _id: userGroupDto.group },
        {
          $push: { members: userGroupDto.user },
          $pull: { requests: userGroupDto.user },
        },
        { new: true },
      );
    }
  };

  deleteMember = async (userGroupDto: UserGroupDto, admin: string) => {
    const groupDb = await this.groupModel.findOne({
      _id: userGroupDto.group,
      members: userGroupDto.user,
    });

    if (!groupDb) throw new NotFoundException('NOT_FOUND');

    if (groupDb.admin.toString() != admin) throw new UnauthorizedException();

    return this.groupModel.findOneAndUpdate(
      { _id: userGroupDto.group, admin, members: userGroupDto.user },
      { $pull: { members: userGroupDto.user } },
      { new: true },
    );
  };

  requestToJoin = async (group: string, user: string) => {
    const groupDb = await this.groupModel.findOne({
      _id: group,
      $nor: [{ banned: user }, { members: user }, { requests: user }],
    });

    if (!groupDb) throw new NotFoundException('NOT_FOUND');

    if (
      groupDb.joinRequestApproval == JoinRequestApproval.ADMIN ||
      groupDb.joinRequestApproval == JoinRequestApproval.MEMBERS
    ) {
      return this.groupModel.findOneAndUpdate(
        {
          _id: group,
          $nor: [{ banned: user }, { members: user }],
        },
        { $push: { requests: user } },
        { new: true },
      );
    } else if (groupDb.joinRequestApproval == JoinRequestApproval.NO) {
      return this.groupModel.findOneAndUpdate(
        {
          _id: group,
          $nor: [{ banned: user }, { members: user }],
        },
        { $push: { members: user } },
        { new: true },
      );
    }
  };

  leaveGroup = async (group: string, user: string) => {
    return this.groupModel.findOneAndUpdate(
      { _id: group, members: user, admin: { $ne: user } },
      { $pull: { members: user } },
      { new: true },
    );
  };

  changeAdmin(userGroupDto: UserGroupDto, admin: string) {
    return this.groupModel.findOneAndUpdate(
      {
        _id: userGroupDto.group,
        admin,
        members: userGroupDto.user,
      },
      { admin: userGroupDto.user },
      { new: true },
    );
  }
}
