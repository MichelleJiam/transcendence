import { Controller, Get, Logger, Post } from "@nestjs/common";
import { AchievementService } from "./achievement.service";

@Controller("/achievement")
export class AchievementController {
  private readonly logger = new Logger(AchievementController.name);

  constructor(private achievementService: AchievementService) {}

  @Get()
  async getAllAchievements() {
    this.logger.log("Hit the getAllAchievements route");
    return "Hello from achievement";
  }

  @Post()
  async addAchievement(id: number) {
    this.logger.log("Hit the addAchievement route");
    return this.achievementService.addAchievement(id);
  }
}

/*

On fontend:

"New Achievement Unlocked! [achievement name] [achievement icon]" 

On backend:

If achievement is not in the list of achievements: add achievement

Add achievement to user (automatically?)
Add user to achievement (automatically?)

*/
