import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
  Body,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { MatchService } from "./match.service";
import { CreateMatchDto } from "./dto/create-match.dto";

@Controller("match")
export class MatchController {
  private readonly logger = new Logger(MatchController.name);
  constructor(private readonly matchService: MatchService) {}

  /* curl http://localhost:3000/match/ */
  @Get()
  async findAll() {
    const matches = await this.matchService.findAll();
    return matches;
  }

  /* curl http://localhost:3000/match/:id */
  @Get(":id")
  async getMatch(@Param("id", ParseIntPipe) id: number) {
    const game = await this.matchService.getMatch(id).catch(() => {
      throw new BadRequestException("error while trying to create match");
    });
    return game;
  }

  /* curl -X POST -d "playerId=5" http://localhost:3000/match/ */
  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    const match = await this.matchService.create(createMatchDto).catch(() => {
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
