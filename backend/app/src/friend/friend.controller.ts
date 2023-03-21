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
  Put,
  UseGuards,
} from "@nestjs/common";
import { User } from "src/user/user.entity";
import { CreateRelationDto, Relation } from "./dto/create-relation.dto";
import { FriendService } from "./friend.service";
import { UserService } from "src/user/user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

type PartialUser = {
  // partial user with relation
  id: number;
  playerName: string;
  status: number;
};

@Controller("/friend")
@UseGuards(JwtAuthGuard)
export class FriendController {
  private readonly logger = new Logger(FriendController.name);

  constructor(
    private readonly friendService: FriendService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllRelations() {
    this.logger.log("Hit the getAllRelations route");
    const relations = await this.friendService.getAllRelations();
    if (relations.length === 0)
      this.logger.debug("There are no Friend entries in the database");
    return await this.friendService.getAllRelations();
  }

  @Get("/relation/users")
  async getUserData(): Promise<Array<PartialUser>> {
    this.logger.log("Hit the getUserData route");
    return await this.userService.getAllUsersPartial();
  }

  @Get("/relation/:source/:target")
  async getRelationStatus(
    @Param("source", ParseIntPipe) source: number,
    @Param("target", ParseIntPipe) target: number,
  ): Promise<object> {
    this.logger.log("Hit the getSingleRelation route");
    const res = await this.friendService.getSingleRelation(source, target);
    if (res.length > 1) {
      this.logger.error(
        "Single relation expected but multiple relations returned",
      );
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    } else if (res.length === 0)
      return { source: 0, target: 0, status: "NONE" };
    else
      return {
        source: (res[0].source as unknown as User).id,
        target: (res[0].target as unknown as User).id,
        status: res[0].status,
      };
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

  @Put("/accept")
  async acceptRequest(@Body() input: Relation) {
    this.logger.log("Hit the acceptRequest route");
    return await this.friendService.acceptRequest(input);
  }

  @Delete("/unfriend")
  @HttpCode(204)
  async unfriend(@Body() input: Relation) {
    this.logger.log("Hit the unfriend route");
    return await this.friendService.unfriend(input);
  }
}
