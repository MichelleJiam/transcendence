import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { CreateRelationDto } from "./dto/create-relation.dto";
import { FriendService } from "./friend.service";

@Controller("/friend")
export class FriendController {
  private readonly logger = new Logger(FriendController.name);

  constructor(private readonly friendService: FriendService) {}

  @Get()
  async getAllRelations() {
    this.logger.log("Hit the getAllRelations route");
    const relations = await this.friendService.getAllRelations();
    if (relations.length === 0)
      this.logger.debug("There are no Friend entries in the database");
    return await this.friendService.getAllRelations();
  }

  @Get(":id")
  async getFriendsForUser(@Param("id", ParseIntPipe) id: number) {
    this.logger.log("Hit the getFriendsForUser route");
    return await this.friendService.getFriendsForUser(id);
  }

  @Post("/request") // request/:from/:to
  async friendRequest(@Body() input: CreateRelationDto) {
    // check if request has already been send
    return await this.friendService.friendRequest(input);
  }

  @Delete(":id/unfriend")
  @HttpCode(204)
  unfriendUser(@Param("id") id: number) {
    return `unfriend ${id}`;
  }
}
