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
import { LeaderboardService } from "src/leaderboard/leaderboard.service";
import { Leaderboard } from "src/leaderboard/leaderboard.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      Game,
      User,
      Avatar,
      Achievement,
      Leaderboard,
    ]),
  ],
  controllers: [MatchController],
  providers: [
    MatchService,
    GameService,
    UserService,
    AvatarService,
    LeaderboardService,
    AchievementService,
  ],
})
export class MatchModule {}
