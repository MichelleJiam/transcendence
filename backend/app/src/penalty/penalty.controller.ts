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
  getMessageById(@Param("id", ParseIntPipe) id: number) {
    return this.penaltyService.getPenaltiesByUserId(id);
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
