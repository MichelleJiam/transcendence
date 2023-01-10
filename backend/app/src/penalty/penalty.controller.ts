import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { PenaltyService } from "./penalty.service";

@Controller("penalty")
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Get()
  getAllPenalties() {
    return this.penaltyService.getAllPenalties();
  }

  @Get("user/id/:id")
  getMessageByUserId(@Param("id", ParseIntPipe) id: number) {
    return this.penaltyService.getPenaltiesByUserId(id);
  }

  @Get("chat/id/:id")
  getMessageByChatId(@Param("id", ParseIntPipe) id: number) {
    return this.penaltyService.getPenaltiesByChatId(id);
  }

  @Post("create")
  create(@Body() createPenaltyDto: CreatePenaltyDto) {
    try {
      return this.penaltyService.createPenalty(createPenaltyDto);
    } catch (err) {
      console.log(err);
    }
  }
}
