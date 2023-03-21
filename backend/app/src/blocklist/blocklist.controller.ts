import {
  Controller,
  Get,
  Post,
  Delete,
  NotFoundException,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from "@nestjs/common";
import { currentUser } from "src/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "src/user/user.entity";
import { isCurrentUser } from "src/user/user.utils";
import { Blocklist } from "./blocklist.entity";
import { BlocklistService } from "./blocklist.service";
import { CreateBlockDto } from "./dto/create-block.dto";
import { DeleteBlockDto } from "./dto/delete-block.dto";

@Controller("blocklist")
@UseGuards(JwtAuthGuard)
export class BlocklistController {
  constructor(private readonly blocklistService: BlocklistService) {}

  @Get("user/:userId")
  async getBlockedUsersForUser(
    @Param("userId", ParseIntPipe) userId: number,
    @currentUser() user: User,
  ): Promise<Blocklist[] | undefined> {
    try {
      isCurrentUser(user.id, userId);
      return this.blocklistService.getBlockedUsersForUser(userId);
    } catch (err) {
      console.error(err);
    }
  }

  @Post("create")
  async blockUser(
    @Body() createBlockDto: CreateBlockDto,
    @currentUser() user: User,
  ): Promise<Blocklist | undefined> {
    try {
      isCurrentUser(user.id, createBlockDto.blocklistOwner);
      return this.blocklistService.createBlockEntryForUser(createBlockDto);
    } catch (err) {
      console.error(err);
    }
  }

  @Delete("remove/owner/:userId/blocked/:blockedId")
  async removeBlock(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("blockedId", ParseIntPipe) blockedId: number,
    @currentUser() user: User,
  ): Promise<void> {
    try {
      isCurrentUser(user.id, userId);
      const deleteBlockDto = new DeleteBlockDto();
      deleteBlockDto.blocklistOwner = userId;
      deleteBlockDto.blockedUser = blockedId;
      return this.blocklistService.deleteBlockEntry(deleteBlockDto);
    } catch (err) {
      console.error(err);
    }
  }
}
