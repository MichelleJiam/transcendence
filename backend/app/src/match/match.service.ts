import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Match } from "./entities/match.entity";
import { GameService } from "src/game/game.service";
import { CreateMatchDto } from "./dto/create-match.dto";
import { CreateGameDto } from "src/game/dto/create-game.dto";
import { MatchPlayerDto } from "./dto/match-player.dto";

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly gameService: GameService,
  ) {}

  async findAll() {
    return await this.matchRepository.find({});
  }

  async findPlayerInMatchQueueByUserId(userId: number) {
    const match = await this.matchRepository.findOne({
      where: { playerId: userId },
    });
    return match;
  }

  async findPlayerInMatchQueueBySocket(socketId: string) {
    const match = await this.matchRepository.findOne({
      where: { playerSocket: socketId },
    });
    return match;
  }

  async findOpponentToPlayGame(matchPlayerDto: MatchPlayerDto) {
    const match = await this.matchRepository.find({
      take: 1,
    });
    if (match.length === 0) {
      const createMatchDto = new CreateMatchDto();
      createMatchDto.playerId = matchPlayerDto.id;
      createMatchDto.playerSocket = matchPlayerDto.socketId;
      this.addToMatchQueue(createMatchDto).catch(() => {
        this.logger.debug("error while creating match in create()");
      });
      return null;
    } else {
      if (match[0].playerId == matchPlayerDto.id) {
        this.logger.debug("cannot match player with themself");
        /* is this even possible and do we want to throw if it does happen? */
        throw new BadRequestException();
      }
      return await this.createGame(match[0].playerId, matchPlayerDto.id);
    }
  }

  async createGame(playerOneId: number, playerTwoId: number) {
    const createGameDto = new CreateGameDto();
    createGameDto.playerOne = playerOneId;
    createGameDto.playerTwo = playerTwoId;
    createGameDto.state = "playing";
    const game = await this.gameService.create(createGameDto).catch(() => {
      this.logger.debug("error in getMatch while trying to create new game");
      throw new BadRequestException();
    });
    this.remove(playerOneId);
    return game;
  }

  async addToMatchQueue(createMatchDto: CreateMatchDto) {
    if (
      (await this.matchRepository.findOne({
        where: {
          playerId: createMatchDto.playerId,
        },
      })) != null
    ) {
      this.logger.debug(
        "unable to add user to queue, user already exists in queue",
      );
      return null;
    }
    const newPlayer = await this.matchRepository.save(createMatchDto);
    return newPlayer;
  }

  async remove(id: number) {
    console.log("Removing player ", id, " from match queue");
    const match = await this.matchRepository.findOne({
      where: {
        playerId: id,
      },
    });
    if (match == null) {
      this.logger.debug("unable to delete player from queue, does not exist");
      return;
    }
    await this.matchRepository.delete(match.id);
  }
}
