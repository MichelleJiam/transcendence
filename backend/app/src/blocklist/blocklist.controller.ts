import { Controller, Get } from "@nestjs/common";
import { BlocklistService } from "./blocklist.service";

@Controller("blocklist")
export class BlocklistController {
  constructor(private readonly blocklistService: BlocklistService) {

    @Get()
    async getGlobalBlocklist() {
      return await this.getGlobalBlocklist();
    }
  }
}
