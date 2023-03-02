import { Controller, Get, Logger, Post } from "@nestjs/common";
import { AchievementService } from "./achievement.service";

@Controller("/achievement")
export class AchievementController {
  private readonly logger = new Logger(AchievementController.name);

  constructor(private achievementService: AchievementService) {}

  @Get()
  async getAllAchievements() {
    this.logger.log("Hit the getAllAchievements route");
    const achievements = await this.achievementService.getAllAchievements();
    if (achievements.length === 0)
      this.logger.debug("There are no achievements in the database");
    return achievements;
  }

  @Post()
  async addAllAchievements() {
    this.logger.log("Hit the addAllAchievements route");
    return await this.achievementService.addAllAchievements();
  }
}
