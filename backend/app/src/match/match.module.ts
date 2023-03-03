import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { AvatarService } from "src/avatar/avatar.service";
import { Avatar } from "src/avatar/avatar.entity";
import { Match } from "./entities/match.entity";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { GameService } from "src/game/game.service";
import { Game } from "src/game/entities/game.entity";
import { Achievement } from "src/achievement/achievement.entity";
import { AchievementService } from "src/achievement/achievement.service";

@Module({
  imports: [TypeOrmModule.forFeature([Match, Game, User, Avatar, Achievement])],
  controllers: [MatchController],
  providers: [
    MatchService,
    GameService,
    UserService,
    AvatarService,
    AchievementService,
  ],
})
export class MatchModule {}
