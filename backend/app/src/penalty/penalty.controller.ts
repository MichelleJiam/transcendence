import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PenaltyService } from "./penalty.service";

@Controller("penalty")
@UseGuards(JwtAuthGuard)
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Get()
  getAllPenalties() {
    return this.penaltyService.getAllPenalties();
  }
}
