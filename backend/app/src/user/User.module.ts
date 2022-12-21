import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chatroom } from "src/chat/Chat.entity";
import { Message } from "src/message/Message.entity";
import { UserController } from "./User.controller";
import { User } from "./User.entity";
import { UserService } from "./User.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Chatroom])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
