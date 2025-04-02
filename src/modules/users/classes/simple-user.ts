import { Types } from 'mongoose';
import { ConnectionStatus } from '../enums/connection-status.enum';

export class SimpleUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
  thumb: string;
  connection: ConnectionStatus = ConnectionStatus.NONE;
}
