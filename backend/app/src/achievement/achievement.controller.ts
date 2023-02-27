import { Controller } from "@nestjs/common";
import { AchievementService } from "./achievement.service";

@Controller("achievement")
export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  /* functions */
}
