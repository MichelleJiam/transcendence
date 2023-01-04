import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";
import { ChatController } from "./chat.controller";
import { Chatroom } from "./chat.entity";
import { ChatService } from "./chat.service";

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Chatroom])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
