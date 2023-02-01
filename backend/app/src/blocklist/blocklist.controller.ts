import { Controller, Get, NotFoundException } from "@nestjs/common";
import { Blocklist } from "./blocklist.entity";
import { BlocklistService } from "./blocklist.service";

@Controller("blocklist")
export class BlocklistController {
  constructor(private readonly blocklistService: BlocklistService) {}

  @Get()
  getGlobalBlocklist(): Promise<Blocklist[]> {
    try {
      return this.blocklistService.getGlobalBlocklist();
    } catch (err) {
      throw NotFoundException;
    }
  }
}
