import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
  Body,
  Put,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { MatchService } from "./match.service";
import { Match } from "./entities/match.entity";
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

  /* curl http://localhost:3000/game/1 */
  @Get(":id")
  async findOne(@Param("id") id: number) {
    const player = await this.matchService.findOne(id);
    if (player === null) {
      this.logger.debug("game does not exist in database");
      throw new NotFoundException("Unable to find game");
    } else {
      return player;
    }
  }

  /* curl -X POST -d "playerId=5" http://localhost:3000/match/ */
  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    const match = await this.matchService.create(createMatchDto).catch(() => {
      throw new NotFoundException("unable to add player to match queue");
    });
    return match;
  }

  //   /* curl -X DELETE http://localhost:3000/game/48 */
  //   @Delete(":id")
  //   @HttpCode(204) /* code for no content used for removing a resource */
  //   async remove(@Param("id", ParseIntPipe) id: number) {
  //     await this.gameService.remove(id);
  //   }
}
