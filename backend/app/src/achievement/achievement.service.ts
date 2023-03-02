import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Achievement } from "./achievement.entity";
import { achievements } from "./achievement";

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name);
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {}

  /* development */
  async getAllAchievements() {
    this.logger.log("Hit the getAllAchievements route");
    return await this.achievementRepository.find();
  }

  /* development */
  async addAllAchievements() {
    this.logger.log("Hit the addAllAchievements route");
    for (const achievement of achievements)
      await this.achievementRepository.save(achievement);
  }

  async getAchievementById(id: number) {
    this.logger.log("Hit the getAchievementById route");
    return await this.achievementRepository.findOneBy({
      id: id,
    });
  }

  async addSingleAchievement(id: number) {
    this.logger.log("Hit the addSingleAchievement route");
    const achievement = await this.getAchievementById(id);
    if (achievement) {
      this.logger.debug("Achievement already exists");
      return;
    } else if (!achievements[id]) {
      this.logger.debug("Invalid achievement id");
      return;
    }
    await this.achievementRepository.save(achievements[id]);
    this.logger.log("Achievement added");
  }
}
