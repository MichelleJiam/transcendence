import { Injectable } from "@nestjs/common";
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

  async findAllGames() {
    const games = await this.gameRepository.find({});
    return games;
  }

  async findOneGame(gameId: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: gameId,
      },
      relations: ["winnerId", "loserId"],
    });
    return game;
  }

  async createGame(userId: number) {
    const game = await this.gameRepository.save({
      playerOne: userId,
      status: "waiting",
    });
    console.log("game created: " + game);
    return game;
  }

  async updateGame(game: Game, userId: number) {
    return await this.gameRepository.save({
      id: game.id,
      playerOne: game.playerOne,
      playerTwo: userId,
      status: "playing",
    });
  }

  // async updateWinner(gameId: number, userId: number) {
  //   const game = await this.gameRepository.findOne({
  //     where: {
  //       id: gameId,
  //     },
  //   });
  //   const user = new User();
  //   user.wins.push(game);
  // }

  async removeGame(gameId: number) {
    await this.gameRepository.delete(gameId);
  }

  async inWaitingState() {
    const game = await this.gameRepository.findOne({
      where: { status: "waiting" },
    });
    if (game) {
      return game;
    }
  }

  // async getUserWins(winner: number) {
  /******************************* tools from tutorial/
  // const games = await this.gameRepository.find({
  // will get all with an id of more than 3
  select: ['id', 'when'],
  // where: [{ 
      id: MoreThan(3),
      status: "playing" },{
        description: Like('%meet%')
      }],
    take: 2
    skip: 
    order: {
      id: 'ASC' or 'DESC' etc for sorting
    }
    });
  /*******************************/

  //   const gamesWon = await this.gameRepository.find({
  //     select: ["id", "winnerId", "winnerScore"],
  //     where: {
  //       winnerId: winner,
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

  // async updateGame(gameId: number, userId: number) {
  //   const game = await this.gameRepository.findOne({
  //     where: {
  //       id: gameId,
  //     },
  //   });

  //   console.log(game);

  //   await this.gameRepository.save({
  //     ...game,
  //     status: "check",
  //   });

  //   console.log(game);
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       id: userId,
  //     },
  //   });
  //   const updatedGame = await this.gameRepository
  //     .createQueryBuilder()
  //     .relation(Game, "users")
  //     .of(game)
  //     .add([user]);
  //   return updatedGame;
  //   /* how to check if successful? */
  //   // throw new HttpException("Game not updated", HttpStatus.NOT_FOUND);
  // }

  /****************************************************************/
  messages: SocketEntity[] = [{ name: "Swaan", text: "heyoo" }];

  clientToUser: { [key: string]: string } = {};

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser); // find out who is currently online
  }

  announce(id: string, clientId: string) {
    console.log(
      "id: ",
      id,
      " with socket id ",
      clientId,
      " has entered the game ",
    );
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
