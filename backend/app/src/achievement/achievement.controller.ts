import { Controller, Get, Logger, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AchievementService } from "./achievement.service";

@Controller("/achievement")
@UseGuards(JwtAuthGuard)
export class AchievementController {
  private readonly logger = new Logger(AchievementController.name);

  constructor(private achievementService: AchievementService) {}

  /* development */
  @Get()
  async getAllAchievements() {
    this.logger.log("Hit the getAllAchievements route");
    const achievements = await this.achievementService.getAllAchievements();
    if (achievements.length === 0)
      this.logger.debug("There are no achievements in the database");
    return achievements;
  }

  /* development */
  @Post()
  async addAllAchievements() {
    this.logger.log("Hit the addAllAchievements route");
    return await this.achievementService.addAllAchievements();
  }
}
