import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AvatarController } from "./avatar.controller";
import { Avatar } from "./avatar.entity";
import { AvatarService } from "./avatar.service";

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
  controllers: [AvatarController], // this can probably go because we use user.controller.ts
  providers: [AvatarService],
})
export class AvatarModule {}
