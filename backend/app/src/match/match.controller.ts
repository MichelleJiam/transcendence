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

  @Get()
  async findAll() {
    const matches = await this.matchService.findAll();
    return matches;
  }

  @Get(":userId")
  async findPlayerInMatchQueue(@Param("userId", ParseIntPipe) userId: number) {
    return await this.matchService.findPlayerInMatchQueueByUserId(userId);
  }

  @Post("/play")
  async findOpponentToPlayGame(@Body() matchPlayer: MatchPlayerDto) {
    const game = await this.matchService
      .findOpponentToPlayGame(matchPlayer)
      .catch(() => {
        throw new BadRequestException("error while trying to create match");
      });
    return game;
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.matchService.remove(id).catch(() => {
      this.logger.debug("match does not exist, unable to delete");
      throw new NotFoundException("match does not exist, unable to delete");
    });
  }
}
