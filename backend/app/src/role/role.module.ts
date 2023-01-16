import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Avatar } from "src/avatar/avatar.entity";
import { AvatarService } from "src/avatar/avatar.service";
import { Chatroom } from "src/chat/chat.entity";
import { ChatService } from "src/chat/chat.service";
import { Message } from "src/message/message.entity";
import { MessageService } from "src/message/message.service";
import { Penalty } from "src/penalty/penalty.entity";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { RoleController } from "./role.controller";
import { Role } from "./role.entity";
import { RoleService } from "./role.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Chatroom, Role, Penalty, Avatar]),
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    ChatService,
    UserService,
    MessageService,
    AvatarService,
  ],
})
export class RoleModule {}
