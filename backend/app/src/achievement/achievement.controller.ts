import { Controller, Logger } from "@nestjs/common";
import { AchievementService } from "./achievement.service";

@Controller("/achievement")
export class AchievementController {
  private readonly logger = new Logger(AchievementController.name);

  constructor(private achievementService: AchievementService) {}
}
