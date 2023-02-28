import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Match } from "./entities/match.entity";
import { UserService } from "src/user/user.service";
import { GameService } from "src/game/game.service";
import { CreateMatchDto } from "./dto/create-match.dto";
import { CreateGameDto } from "src/game/dto/create-game.dto";

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

  async findAll() {
    return await this.matchRepository.find({});
  }

  async findMatch(id: number) {
    if ((await this.userService.findUserById(id)) == null) {
      this.logger.debug("unable to match, user does not exist");
      throw new NotFoundException();
    }
    const match = await this.matchRepository.find({
      take: 1,
    });
    if (match.length === 0) {
      const createMatchDto = new CreateMatchDto();
      createMatchDto.playerId = id;
      this.create(createMatchDto).catch(() => {
        this.logger.debug("error while creating match in create()");
        throw new BadRequestException();
      });
      return null;
    } else {
      if (match[0].playerId == id) {
        this.logger.debug("cannot match player with themself");
        throw new BadRequestException();
      }
      /* abstract to different method that takes two ids */
      const createGameDto = new CreateGameDto();
      createGameDto.playerOne = match[0].playerId;
      createGameDto.playerTwo = id;
      createGameDto.state = "playing";
      const game = await this.gameService.create(createGameDto).catch(() => {
        this.logger.debug("error in getMatch while trying to create new game");
        throw new BadRequestException();
      });
      this.remove(match[0].playerId);
      return game;
    }
  }

  async create(createMatchDto: CreateMatchDto) {
    if (
      (await this.userService.findUserById(createMatchDto.playerId)) == null
    ) {
      this.logger.debug("unable to add user to match, user does not exist");
      throw new NotFoundException();
    }
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
      throw new BadRequestException();
    }
    const newPlayer = await this.matchRepository.save(createMatchDto);
    return newPlayer;
  }

  async remove(id: number) {
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
