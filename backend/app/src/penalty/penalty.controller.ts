import { Controller, Get } from "@nestjs/common";
import { PenaltyService } from "./penalty.service";

@Controller("penalty")
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Get()
  getAllPenalties() {
    return this.penaltyService.getAllPenalties();
  }
}
