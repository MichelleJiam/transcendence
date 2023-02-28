import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Achievement } from "./achievement.entity";
import { achievementTypes } from "./achievement";

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {}

  /* functions */

  async addAchievement(id: number) {
    const achievement = await this.achievementRepository.findOneBy({
      id: id,
    });
    if (achievement === null)
      await this.achievementRepository.save(achievementTypes[id]);
  }
}
