import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { UserGroupDto } from './dtos/user-group.dto';
import { GroupDto } from './dtos/group.dto';
import { UserGuard } from 'src/common/guards/user.guard';

@Controller('groups')
@UseGuards(UserGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  getGroup(@Query() query: GroupDto) {
    return this.groupsService.getGroupInfo(query.group);
  }

  @Post('new')
  createGroup(@Body() body: CreateGroupDto, @Request() req: any) {
    return this.groupsService.create(body, req.user.id);
  }

  @Post('request-to-join')
  requestToJoin(@Body() body: GroupDto, @Request() req: any) {
    return this.groupsService.requestToJoin(body.group, req.user.id);
  }

  @Patch('leave-group')
  leaveGroup(@Body() body: GroupDto, @Request() req: any) {
    return this.groupsService.leaveGroup(body.group, req.user.id);
  }

  @Patch('add-member')
  addMember(@Body() body: UserGroupDto, @Request() req: any) {
    return this.groupsService.addMember(body, req.user.id);
  }

  @Patch('change-admin')
  changeAdmin(@Body() body: UserGroupDto, @Request() req: any) {
    return this.groupsService.changeAdmin(body, req.user.id);
  }

  @Patch('update')
  updateGroup(@Body() body: UpdateGroupDto, @Request() req: any) {
    return this.groupsService.update(req.user.id, body);
  }

  @Delete('delete-member')
  deleteMember(@Body() body: UserGroupDto, @Request() req: any) {
    return this.groupsService.deleteMember(body, req.user.id);
  }
}
