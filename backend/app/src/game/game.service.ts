import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";
import { SocketEntity } from "./entities/socket.entity";
import { CreateSocketDto } from "./dto/create-socket.dto";
import { User } from "src/user/user.entity";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllGames() {
    const games = await this.gameRepository.find();
    return games;
  }

  async getGameById(id: number): Promise<Game[]> {
    const game = await this.gameRepository.findBy({ id });
    return game;
  }

  async deleteGame(gameId: number) {
    const deleteGame = await this.gameRepository.delete(gameId);
    if (!deleteGame.affected) {
      throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
    }
  }

  async createGame(userId: number) {
    const newGame = await this.gameRepository.create({
      users: [
        {
          id: userId,
        },
      ],
      status: "waiting",
    });
    await this.gameRepository.save(newGame);
    console.log("createGame object" + newGame);
    return newGame;
  }

  async updateGame(gameId: number, userId: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: gameId,
      },
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

    console.log(updatedGame);
    return updatedGame;

    // const updatedGame = await this.gameRepository.update(gameId, {
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
  }

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
