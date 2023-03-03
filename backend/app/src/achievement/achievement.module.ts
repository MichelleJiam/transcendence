import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AchievementController } from "./achievement.controller";
import { Achievement } from "./achievement.entity";
import { AchievementService } from "./achievement.service";

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  controllers: [AchievementController],
  providers: [AchievementService],
})
export class AchievementModule {}
