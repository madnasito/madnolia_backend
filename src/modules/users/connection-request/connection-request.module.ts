import { Module } from '@nestjs/common';
import {
  ConnectionRequest,
  ConnectionRequestSchema,
} from './schemas/connection-request.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionRequestService } from './connection-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConnectionRequest.name, schema: ConnectionRequestSchema },
    ]),
  ],
  providers: [ConnectionRequestService],
  exports: [ConnectionRequestService],
})
export class ConnectionRequestModule {}
