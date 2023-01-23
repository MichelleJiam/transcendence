import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/message/message.entity";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { Avatar } from "src/avatar/avatar.entity";
import { AvatarService } from "src/avatar/avatar.service";
import { Chatroom } from "src/chat/chat.entity";
import { Blocklist } from "src/blocklist/blocklist.entity";
import { BlocklistService } from "src/blocklist/blocklist.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message, Avatar, Chatroom, Blocklist]),
  ],
  controllers: [UserController],
  providers: [UserService, AvatarService, BlocklistService],
})
export class UserModule {}
