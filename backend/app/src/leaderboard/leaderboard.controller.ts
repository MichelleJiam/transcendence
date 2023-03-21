import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Leaderboard } from "./leaderboard.entity";
import { LeaderboardService } from "./leaderboard.service";

@Controller("leaderboard")
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard() {
    return await this.leaderboardService.getLeaderboard();
  }

  @Get(":userId")
  async getLeaderboardOfUserById(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<Leaderboard | null> {
    return await this.leaderboardService.getLeaderboardOfUserById(userId);
  }
}
