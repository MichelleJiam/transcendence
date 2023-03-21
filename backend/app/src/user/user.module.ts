import { AuthModule } from "./../auth/auth.module";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/message/message.entity";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { Avatar } from "src/avatar/avatar.entity";
import { AvatarService } from "src/avatar/avatar.service";
import { Game } from "src/game/entities/game.entity";
import { Chatroom } from "src/chat/chat.entity";
import { Blocklist } from "src/blocklist/blocklist.entity";
import { BlocklistService } from "src/blocklist/blocklist.service";
import { JwtModule } from "@nestjs/jwt";
import { Achievement } from "src/achievement/achievement.entity";
import { AchievementService } from "src/achievement/achievement.service";
import { Leaderboard } from "src/leaderboard/leaderboard.entity";
import { LeaderboardService } from "src/leaderboard/leaderboard.service";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      User,
      Message,
      Avatar,
      Game,
      Chatroom,
      Blocklist,
      Achievement,
      Leaderboard,
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          algorithm: "HS256",
          expiresIn: process.env.JWT_EXPIRATION,
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AvatarService,
    BlocklistService,
    AchievementService,
    LeaderboardService,
  ],
  exports: [UserService],
})
export class UserModule {}
