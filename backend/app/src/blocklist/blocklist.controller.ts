import {
  Controller,
  Get,
  Post,
  Delete,
  NotFoundException,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { Blocklist } from "./blocklist.entity";
import { BlocklistService } from "./blocklist.service";
import { CreateBlockDto } from "./dto/create-block.dto";
import { DeleteBlockDto } from "./dto/delete-block.dto";

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

  @Get("user/:userId")
  async getBlockedUsersForUser(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<Blocklist[]> {
    return this.blocklistService.getBlockedUsersForUser(userId);
  }

  @Post("create")
  async blockUser(
    createBlockDto: CreateBlockDto,
  ): Promise<Blocklist | undefined> {
    return this.blocklistService.createBlockEntryForUser(createBlockDto);
  }

  @Delete("remove")
  async removeBlock(deleteBlockDto: DeleteBlockDto): Promise<void> {
    return this.blocklistService.deleteBlockEntry(deleteBlockDto);
  }
}
