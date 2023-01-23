import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
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

  /* LEFT OFF HERE, IMPLEMENT THIS FUNCTIONALITY */
  @Get("/relation/:source/:target")
  async getSingleRelation(
    @Param("source", ParseIntPipe) source: number,
    @Param("target", ParseIntPipe) target: number,
  ) {
    this.logger.log("Hit the getSingleRelation route");
    console.log(source);
    console.log(target);
  }

  @Get(":id")
  async getFriendsForUser(@Param("id", ParseIntPipe) id: number) {
    this.logger.log("Hit the getFriendsForUser route");
    return await this.friendService.getFriendsForUser(id);
  }

  @Post("/request")
  async friendRequest(@Body() input: CreateRelationDto) {
    this.logger.log("Hit the friendRequest route");
    await this.friendService
      .checkRequest(input.source, input.target)
      .catch(function () {
        throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
      });
    return await this.friendService.friendRequest(input);
  }

  @Delete(":id/unfriend")
  @HttpCode(204)
  unfriendUser(@Param("id") id: number) {
    return `unfriend ${id}`;
  }
}
