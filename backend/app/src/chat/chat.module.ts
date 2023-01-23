import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Avatar } from "src/avatar/avatar.entity";
import { AvatarService } from "src/avatar/avatar.service";
import { Message } from "src/message/message.entity";
import { MessageService } from "src/message/message.service";
import { Penalty } from "src/penalty/penalty.entity";
import { PenaltyMethod } from "src/penalty/penalty.method";
import { PenaltyService } from "src/penalty/penalty.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ChatController } from "./chat.controller";
import { Chatroom } from "./chat.entity";
import { ChatMethod } from "./chat.methods";
import { ChatService } from "./chat.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Chatroom, Avatar, Penalty]),
  ],
  controllers: [ChatController],
  providers: [
    PenaltyService,
    PenaltyMethod,
    ChatService,
    ChatMethod,
    UserService,
    MessageService,
    AvatarService,
  ],
})
export class ChatModule {}
