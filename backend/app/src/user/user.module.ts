import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/message/Message.entity";
import { UserController } from "./User.controller";
import { User } from "./User.entity";
import { UserService } from "./User.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
