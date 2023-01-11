import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/message/message.entity";
import { Penalty } from "src/penalty/penalty.entity";
import { PenaltyService } from "src/penalty/penalty.service";
import { Role } from "src/role/role.entity";
import { RoleService } from "src/role/role.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ChatController } from "./chat.controller";
import { Chatroom } from "./chat.entity";
import { ChatService } from "./chat.service";

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Chatroom, Role, Penalty])],
  controllers: [ChatController],
  providers: [ChatService, RoleService, UserService, PenaltyService],
})
export class ChatModule {}
