import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { UpdateLeaderboardUserDto } from "./dto/update-leaderboard-user.dto";
import { Leaderboard } from "./leaderboard.entity";

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
  ) {}

  async getLeaderboard() {
    const leaderboard = await this.leaderboardRepository.find({
      relations: {
        user: true,
      },
      order: {
        user: {
          id: "asc", // potentially change this to rate later that will then sort the list by ascending value of the rate
        },
      },
    });
    return leaderboard;
  }

  async getLeaderboardOfUserById(userId: number): Promise<Leaderboard | null> {
    return await this.leaderboardRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createUserForLeaderboard(user: User): Promise<Leaderboard> {
    const newLeaderboardEntry = new Leaderboard();
    newLeaderboardEntry.user = user;
    return await this.leaderboardRepository.save(newLeaderboardEntry);
  }

  async updateWinnerData(winnerId: number) {
    const winner = await this.leaderboardRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: winnerId,
        },
      },
    });
    if (winner) {
      winner.wins += 1;
      // calculate the new rate for the winner
      return await this.leaderboardRepository.save(winner);
    }
  }

  async updateLoserData(loserId: number) {
    const loser = await this.leaderboardRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: loserId,
        },
      },
    });

    if (loser) {
      loser.losses += 1;
      // calculate the new rate for the loser
      return await this.leaderboardRepository.save(loser);
    }
  }

  // calculate new rate function?

  async updateUsersInLeaderboard(
    updateLeaderboardUserDto: UpdateLeaderboardUserDto,
  ): Promise<Leaderboard[]> {
    await this.updateWinnerData(updateLeaderboardUserDto.winner);
    await this.updateLoserData(updateLeaderboardUserDto.loser);

    return await this.getLeaderboard(); // change this later
  }
}
