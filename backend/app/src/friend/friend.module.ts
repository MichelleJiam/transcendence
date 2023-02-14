import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friend } from "./friend.entity";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";
import { FriendGateway } from "./friend.gateway";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";
import { AvatarService } from "src/avatar/avatar.service";
import { Avatar } from "src/avatar/avatar.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User, Avatar])],
  controllers: [FriendController],
  providers: [FriendService, FriendGateway, UserService, AvatarService],
})
export class FriendModule {}
