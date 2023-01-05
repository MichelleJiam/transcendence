import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database.module";
<<<<<<< HEAD
import { ChatModule } from "./chat/chat.module";
=======
import * as Joi from "joi";
>>>>>>> 3ed81b92ae4fc9f3eae939aec641943b3b41864f

@Module({
  imports: [
    UserModule,
    MessageModule,
    ChatModule,
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
  providers: [AppService],
})
export class AppModule {}
