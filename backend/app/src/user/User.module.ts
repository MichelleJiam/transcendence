import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chatroom } from "src/chat/Chat.entity";
import { Message } from "src/message/Message.entity";
import { UserController } from "./User.controller";
import { User } from "./User.entity";
import { UserService } from "./User.service";
import { Avatar } from "src/avatar/avatar.entity";
import { AvatarService } from "src/avatar/avatar.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Avatar])],
  controllers: [UserController],
  providers: [UserService, AvatarService],
})
export class UserModule {}
