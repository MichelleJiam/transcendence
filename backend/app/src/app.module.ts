import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database.module";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";
import { AvatarModule } from "./avatar/avatar.module";

@Module({
	imports: [
		UserModule,
		MessageModule,
		AvatarModule,
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
		MulterModule.register({ dest: "./uploads" }),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
