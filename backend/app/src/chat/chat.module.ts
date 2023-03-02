import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Achievement } from "src/achievement/achievement.entity";
import { AchievementService } from "src/achievement/achievement.service";
import { Avatar } from "src/avatar/avatar.entity";
import { AvatarService } from "src/avatar/avatar.service";
import { Blocklist } from "src/blocklist/blocklist.entity";
import { BlocklistService } from "src/blocklist/blocklist.service";
import { Message } from "src/message/message.entity";
import { MessageService } from "src/message/message.service";
import { Penalty } from "src/penalty/penalty.entity";
import { PenaltyService } from "src/penalty/penalty.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ChatController } from "./chat.controller";
import { Chatroom } from "./chat.entity";
import { ChatGateway } from "./chat.gateway";
import { ChatMethod } from "./chat.methods";
import { ChatService } from "./chat.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      User,
      Chatroom,
      Avatar,
      Penalty,
      Blocklist,
      Achievement,
    ]),
  ],
  controllers: [ChatController],
  providers: [
    BlocklistService,
    PenaltyService,
    ChatService,
    ChatMethod,
    ChatGateway,
    UserService,
    MessageService,
    AvatarService,
    AchievementService,
  ],
})
export class ChatModule {}
