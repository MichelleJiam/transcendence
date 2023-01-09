import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGameDto } from "./dto/create-game.dto";
import { Game } from "./entities/game.entity";
import { UpdateGameDto } from "./dto/update-game.dto";
import { SocketEntity } from "./entities/socket.entity";
import { CreateSocketDto } from "./dto/create-socket.dto";

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

  match(id: number) {
    console.log(id);
    // id you can use to retrieve user specific info from the database
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

  /****************************************************************/
  messages: SocketEntity[] = [{ name: "Swaan", text: "heyoo" }];

  clientToUser: { [key: string]: string } = {};

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser); // find out who is currently online
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  create(createSocketDto: CreateSocketDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createSocketDto.text,
    };
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }
}
