import { TwoFactorModule } from "./2FA/twofactor-auth.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database.module";
import { GameModule } from "./game/game.module";
import { ChatModule } from "./chat/chat.module";
import * as Joi from "joi";
import { PenaltyModule } from "./penalty/penalty.module";
import { BlocklistModule } from "./blocklist/blocklist.module";
import { PenaltyDelete } from "./penalty/penalty.scheduler";
import { AuthModule } from "./auth/auth.module";
import { MatchModule } from "./match/match.module";
import { FriendModule } from "./friend/friend.module";
import { AchievementModule } from "./achievement/achievement.module";

@Module({
  imports: [
    UserModule,
    MessageModule,
    GameModule,
    MatchModule,
    ChatModule,
    PenaltyModule,
    BlocklistModule,
    FriendModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    TwoFactorModule,
    AchievementModule,
  ],
  controllers: [AppController],
  providers: [AppService, PenaltyDelete],
})
export class AppModule {}
