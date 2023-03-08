import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository, WhereExpressionBuilder } from "typeorm";
import { Game } from "./entities/game.entity";
import { UserService } from "src/user/user.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameRoom } from "./pong.types";
import { LeaderboardService } from "src/leaderboard/leaderboard.service";
import { UpdateLeaderboardUserDto } from "src/leaderboard/dto/update-leaderboard-user.dto";

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly userService: UserService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  async findAll() {
    return await this.gameRepository.find({});
  }

  async findActive() {
    const games = await this.gameRepository.find({
      where: {
        state: "playing",
      },
    });
    return games;
  }

  async findOne(id: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: id,
      },
    });
    return game;
  }

  async findGamesFromId(id: number) {
    return await this.gameRepository
      .createQueryBuilder("game")
      .where(
        "game.state = :done AND (game.playerOne = :playerOneId OR game.playerTwo = :playerTwoId)",
        { done: "done", playerOneId: id, playerTwoId: id },
      )
      .execute();
  }

  async findGameFromPlayerSocket(playerSocket: string) {
    const foundGame = this.gameRepository
      .createQueryBuilder("game")
      .where("game.state = :playing", { playing: "playing" })
      .andWhere(
        new Brackets((qb: WhereExpressionBuilder) => {
          qb.where("game.playerOneSocket = :playerSocket", {
            playerSocket,
          }).orWhere("game.playerTwoSocket = :playerSocket", { playerSocket });
        }),
      );
    return await foundGame.getOne();
  }

  async findGameFromDm(id: number) {
    return await this.gameRepository
      .createQueryBuilder("game")
      .where(
        "game.state = :dm AND (game.playerOne = :playerOneId OR game.playerTwo = :playerTwoId)",
        { dm: "dm", playerOneId: id, playerTwoId: id },
      )
      .execute();
  }

  async create(createGameDto: CreateGameDto) {
    if (createGameDto.playerOne === createGameDto.playerTwo) {
      this.logger.debug("cannot create game, players are not unique");
      throw new BadRequestException();
    }
    if (
      (await this.userService.findUserById(createGameDto.playerOne)) == null
    ) {
      this.logger.debug("playerOne does not exist in database");
      throw new NotFoundException();
    }
    if (
      (await this.userService.findUserById(createGameDto.playerTwo)) == null
    ) {
      this.logger.debug("playerTwo does not exist in database");
      throw new NotFoundException();
    }
    /* do we need safeguard to check if either player is already playing - is that even possible? */
    return await this.gameRepository.save(createGameDto);
  }

  async updateSocket(gameRoom: GameRoom) {
    if ((await this.findOne(Number(gameRoom.id))) == null) {
      this.logger.debug("game does not exist, unable to update");
      throw new NotFoundException(
        "Unable to update game because game does not exist",
      );
    }
    const game = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        playerOneSocket: gameRoom.playerOne.socket,
        playerTwoSocket: gameRoom.playerTwo.socket,
      })
      .where("id = :id", { id: gameRoom.id })
      .execute();
    return game;
  }

  async update(gameRoom: GameRoom) {
    if ((await this.findOne(Number(gameRoom.id))) == null) {
      this.logger.debug("game does not exist, unable to update");
      throw new NotFoundException(
        "Unable to update game because game does not exist",
      );
    }
    const highScore = Math.max(
      gameRoom.playerOne.score,
      gameRoom.playerTwo.score,
    );
    const lowScore = Math.min(
      gameRoom.playerOne.score,
      gameRoom.playerTwo.score,
    );
    if (gameRoom.playerOne.score > gameRoom.playerTwo.score) {
      gameRoom.winner = gameRoom.playerOne.id;
      gameRoom.loser = gameRoom.playerTwo.id;
    } else if (gameRoom.playerOne.score < gameRoom.playerTwo.score) {
      gameRoom.loser = gameRoom.playerOne.id;
      gameRoom.winner = gameRoom.playerTwo.id;
    }
    const game = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        winnerId: gameRoom.winner,
        loserId: gameRoom.loser,
        winnerScore: highScore,
        loserScore: lowScore,
        state: "done",
      })
      .where("id = :id", { id: gameRoom.id })
      .execute();
    const leaderboardDto = new UpdateLeaderboardUserDto();
    leaderboardDto.winner = gameRoom.winner;
    leaderboardDto.loser = gameRoom.loser;
    await this.leaderboardService.updateUsersInLeaderboard(leaderboardDto);
    return game;
  }

  async remove(gameId: number) {
    if (this.findOne(gameId) == null) {
      this.logger.debug("game does not exist, unable to delete");
      throw new NotFoundException("game does not exist, unable to delete");
    }
    await this.gameRepository.delete(gameId);
  }
}
