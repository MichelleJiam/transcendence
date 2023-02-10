import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database.module";
import { ChatModule } from "./chat/chat.module";
import * as Joi from "joi";
import { PenaltyModule } from "./penalty/penalty.module";
import { BlocklistModule } from "./blocklist/blocklist.module";
import { PenaltyDelete } from "./penalty/penalty.scheduler";

@Module({
  imports: [
    UserModule,
    MessageModule,
    ChatModule,
    PenaltyModule,
    BlocklistModule,
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
  ],
  controllers: [AppController],
  providers: [AppService, PenaltyDelete],
})
export class AppModule {}
