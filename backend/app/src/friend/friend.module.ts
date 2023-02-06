import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friend } from "./friend.entity";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";
import { FriendGateway } from "./friend.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  controllers: [FriendController],
  providers: [FriendService, FriendGateway],
})
export class FriendModule {}
