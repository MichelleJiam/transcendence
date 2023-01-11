import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { Game } from "./entities/game.entity";
import { SocketEntity } from "./entities/socket.entity";
import { CreateSocketDto } from "./dto/create-socket.dto";
import { User } from "src/user/user.entity";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /* respository methods return a promise so functions need to be async */
  /* find method will iterate over array and return true or false */
  async findAllGames() {
    const games = await this.gameRepository.find({
      // will get all with an id of more than 3
      where: { id: MoreThan(3), status: "playing" },
    });

    return games;
  }

  async findOneGame(gameId: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: gameId,
      },
    });
    return game;
  }

  async createGame(createGameDto: CreateGameDto, userId: number) {
    const newGame = await this.gameRepository.save({
      ...createGameDto,
      users: [
        {
          id: userId,
        },
      ],
      status: "waiting",
    });
    return newGame;
  }

  async updateGame(gameId: number, userId: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: gameId,
      },
    });
    await this.gameRepository.save({
      ...game,
      status: "playing",
    });
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const updatedGame = await this.gameRepository
      .createQueryBuilder()
      .relation(Game, "users")
      .of(game)
      .add([user]);

    return updatedGame;
  }

  // const updatedGame = await this.gameRepository.update(gameId, {
  //   ...updateGameDto
  //   users: [
  //     {
  //       id: userId,
  //     },
  //   ],
  //   status: "playing",
  // });
  // if (updatedGame) {
  //   return updatedGame;
  // }
  // throw new HttpException("Game not updated", HttpStatus.NOT_FOUND);
  // }

  // async getUserWins(winnerId: number) {
  //   const gamesWon = await this.gameRepository.find({
  //     select: ["id", "winnerId", "winnerScore"],
  //     where: {
  //       winnerId: winnerId,
  //     },
  //     relations: {
  //       users: true,
  //     },
  //   });
  //   if (gamesWon) return gamesWon;
  // }

  // async getUserLosses(loserId: number) {
  //   const gamesLost = await this.gameRepository.find({
  //     select: ["id", "loserId", "loserScore"],
  //     where: {
  //       loserId: loserId,
  //     },
  //     relations: {
  //       users: true,
  //     },
  //   });
  //   if (gamesLost) return gamesLost;
  // }

  // async removeGame(gameId: number) {
  //   const game = await this.gameRepository.delete(gameId);
  //   if (!game.affected) {
  //     throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
  //   }
  // }
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

  findAllMessages() {
    return this.messages;
  }
}
