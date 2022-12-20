import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./App.controller";
import { AppService } from "./App.service";
import { DatabaseModule } from "./Database.module";
import { MessageModule } from "./message/Message.module";
import { UserModule } from "./user/User.module";

@Module({
  imports: [
    UserModule,
    MessageModule,
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
