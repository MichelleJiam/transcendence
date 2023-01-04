import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/message/message.entity";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { Avatar } from "src/avatar/avatar.entity";
import { AvatarService } from "src/avatar/avatar.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Avatar])],
  controllers: [UserController],
  providers: [UserService, AvatarService],
})
export class UserModule {}
