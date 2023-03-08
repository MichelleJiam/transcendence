import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
  Logger,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Post,
  Body,
} from "@nestjs/common";
import { MatchService } from "./match.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchPlayerDto } from "./dto/match-player.dto";

@Controller("match")
@UseGuards(JwtAuthGuard)
export class MatchController {
  private readonly logger = new Logger(MatchController.name);
  constructor(private readonly matchService: MatchService) {}

  /* curl http://localhost:3000/match/ */
  @Get()
  async findAll() {
    const matches = await this.matchService.findAll();
    return matches;
  }

  @Get(":userId")
  async findPlayerInMatchQueue(@Param("userId", ParseIntPipe) userId: number) {
    return await this.matchService.findPlayerInMatchQueueByUserId(userId);
  }

  /* curl http://localhost:3000/match/:id */
  @Post("/play/:userId")
  async findOpponentToPlayGame(
    @Param("userId", ParseIntPipe) userId: number, // remove?
    @Body() matchPlayer: MatchPlayerDto,
  ) {
    // console.log("finding opponent for socket ", matchPlayer.socketId);
    const game = await this.matchService
      .findOpponentToPlayGame(matchPlayer)
      .catch(() => {
        throw new BadRequestException("error while trying to create match");
      });
    return game;
  }

  /* curl -X POST -d "playerId=5" http://localhost:3000/match/ */
  /* method not currently used */
  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    const match = await this.matchService
      .addToMatchQueue(createMatchDto)
      .catch(() => {
        throw new BadRequestException("unable to add player to match queue");
      });
    return match;
  }

  /* curl -X DELETE http://localhost:3000/match/1 */
  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.matchService.remove(id).catch(() => {
      this.logger.debug("match does not exist, unable to delete");
      throw new NotFoundException("match does not exist, unable to delete");
    });
  }
}
