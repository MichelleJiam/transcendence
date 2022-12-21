import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/message/Message.entity";
import { User } from "src/user/User.entity";
import { ChatController } from "./Chat.controller";
import { Chatroom } from "./Chat.entity";
import { ChatService } from "./Chat.service";

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Chatroom])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
