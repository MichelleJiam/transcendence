import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
        rate: "desc",
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
      return winner;
    }
    throw new HttpException("winner userId not found.", HttpStatus.NOT_FOUND);
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
      return loser;
    }
    throw new HttpException("loser userId not found.", HttpStatus.NOT_FOUND);
  }

  // calculate new rate function?
  async calculateRate(winner: Leaderboard, loser: Leaderboard) {
    const int = Math.trunc;
    const winnerExpect = 1 / (1 + (10 ^ ((loser.rate - winner.rate) / 400)));
    const loserExpect = 1 - winnerExpect;

    winner.rate = int(winner.rate + 20 * (1 - winnerExpect));
    loser.rate = int(loser.rate + 20 * (1 - loserExpect));
    await this.leaderboardRepository.save(winner);
    await this.leaderboardRepository.save(loser);
  }

  async updateUsersInLeaderboard(
    updateLeaderboardUserDto: UpdateLeaderboardUserDto,
  ): Promise<Leaderboard[]> {
    const winner = await this.updateWinnerData(updateLeaderboardUserDto.winner);
    const loser = await this.updateLoserData(updateLeaderboardUserDto.loser);
    if (winner && loser) this.calculateRate(winner, loser);
    return await this.getLeaderboard(); // change this later
  }
}
