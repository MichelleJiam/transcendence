import { TwoFactorModule } from "./2FA/twofactor-auth.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database.module";
import * as Joi from "joi";
import { AuthModule } from "./auth/auth.module";
import { FriendModule } from "./friend/friend.module";

@Module({
  imports: [
    UserModule,
    MessageModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
