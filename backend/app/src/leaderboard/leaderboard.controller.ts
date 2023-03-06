import {
  Controller,
  Post,
  Get,
  Body,
  Put,
  ParseIntPipe,
  Param,
} from "@nestjs/common";
import { UpdateLeaderboardUserDto } from "./dto/update-leaderboard-user.dto";
import { Leaderboard } from "./leaderboard.entity";
import { LeaderboardService } from "./leaderboard.service";

@Controller("leaderboard")
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

  // remove these upon game integration
  @Put("/update")
  async updateUsersInLeaderboard(
    @Body() updateLeaderboardUserDto: UpdateLeaderboardUserDto,
  ): Promise<Leaderboard[]> {
    return await this.leaderboardService.updateUsersInLeaderboard(
      updateLeaderboardUserDto,
    );
  }
}
