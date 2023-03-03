import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Achievement } from "src/achievement/achievement.entity";
import { AchievementService } from "src/achievement/achievement.service";
import { Avatar } from "src/avatar/avatar.entity";
import { AvatarService } from "src/avatar/avatar.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { BlocklistController } from "./blocklist.controller";
import { Blocklist } from "./blocklist.entity";
import { BlocklistService } from "./blocklist.service";

@Module({
  imports: [TypeOrmModule.forFeature([Blocklist, User, Avatar, Achievement])],
  controllers: [BlocklistController],
  providers: [BlocklistService, UserService, AvatarService, AchievementService],
})
export class BlocklistModule {}
