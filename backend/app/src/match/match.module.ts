import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { AvatarService } from "src/avatar/avatar.service";
import { Avatar } from "src/avatar/avatar.entity";
import { Match } from "./entities/match.entity";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";

@Module({
  imports: [TypeOrmModule.forFeature([Match, User, Avatar])],
  controllers: [MatchController],
  providers: [MatchService, UserService, AvatarService],
})
export class MatchModule {}
