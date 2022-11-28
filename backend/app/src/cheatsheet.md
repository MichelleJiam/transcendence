# Cheatsheet of order of doing things
## Packages to install
```
npm install @nestjs/config
npm install @nestjs/typeorm typeorm mysql2
npm install pg
npm install class-validator
npm install @hapi/joi @types/hapi__joi
```

## Packages to install frontend
```
npm install axios --save
```

## Linking app with db
1. create an .env file and fill in variables for HOST, PORT, DB_USERNAME, DB_PASSWORD and DB_NAME (you can change the names as you see fit.)
2. in app.module.ts, apply the ConfigModule and Joi module in imports
```ts
import Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		UserModule,
		ConfigModule.forRoot({
		  validationSchema: Joi.object({
			POSTGRES_HOST: Joi.string().required(),
			POSTGRES_PORT: Joi.number().required(),
			POSTGRES_USER: Joi.string().required(),
			POSTGRES_PASSWORD: Joi.string().required(),
			POSTGRES_DB: Joi.string().required(),
			PORT: Joi.number(),
		  })
		})
	  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Plan
1. Generate a folder within src with the module name. ie. `./generate_components.sh user` for a user folder.
2. create a `dto` folder in the newly created folder (if applicable, for data transfering)
3. create an `entity.ts` file (if applicable, for the table used in the module)

In the `user.module.ts` file, add `imports: [TypeOrmModule.forFeature([User])],` to the module to link the table to nestjs.

In `user.service.ts` add relevant methods

In `user.controller.ts` add proper decorators per behaviour.

