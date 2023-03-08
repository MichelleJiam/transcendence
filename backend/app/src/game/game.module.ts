import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { User } from "src/user/user.entity";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { UserService } from "src/user/user.service";
import { AvatarService } from "src/avatar/avatar.service";
import { Avatar } from "src/avatar/avatar.entity";
import { GameGateway } from "./game.gateway";
import { AchievementService } from "src/achievement/achievement.service";
import { Achievement } from "src/achievement/achievement.entity";
import { Leaderboard } from "src/leaderboard/leaderboard.entity";
import { LeaderboardService } from "src/leaderboard/leaderboard.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, User, Avatar, Achievement, Leaderboard]),
  ],
  controllers: [GameController],
  providers: [
    GameService,
    UserService,
    LeaderboardService,
    AvatarService,
    GameGateway,
    AchievementService,
  ],
})
export class GameModule {}
