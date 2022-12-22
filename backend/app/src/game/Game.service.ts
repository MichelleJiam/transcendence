import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGameDto } from "./dto/CreateGame.dto";
import { Game } from "./entities/Game.entity";
import { UpdateGameDto } from "./dto/UpdateGame.dto";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  getAllGames() {
    return this.gameRepository.find();
  }

  async getGameById(id: number): Promise<Game[]> {
    const games = await this.gameRepository.findBy({ id });
    return games;
  }

  async getUserWins(winnerId: number) {
    const gamesWon = await this.gameRepository.find({
      select: ["id", "winnerId", "winnerScore"],
      where: {
        winnerId: winnerId,
      },
      relations: {
        users: true,
      },
    });
    if (gamesWon) return gamesWon;
  }

  async getUserLosses(loserId: number) {
    const gamesLost = await this.gameRepository.find({
      select: ["id", "loserId", "loserScore"],
      where: {
        loserId: loserId,
      },
      relations: {
        users: true,
      },
    });
    if (gamesLost) return gamesLost;
  }

  async createGame(createGameDto: CreateGameDto) {
    const newGame = await this.gameRepository.create(createGameDto);
    await this.gameRepository.save(newGame);
    return newGame;
  }

  async updateGame(id: number, game: UpdateGameDto) {
    await this.gameRepository.update(id, game);
    const updatedGame = await this.getGameById(id);
    if (updatedGame) {
      return updatedGame;
    }
    throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
  }
}
