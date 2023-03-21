import { Controller, Logger, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AchievementService } from "./achievement.service";

@Controller("/achievement")
@UseGuards(JwtAuthGuard)
export class AchievementController {
  private readonly logger = new Logger(AchievementController.name);

  constructor(private achievementService: AchievementService) {}
}
