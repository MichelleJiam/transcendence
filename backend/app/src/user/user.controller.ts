import { currentUser } from "./../auth/decorators/current-user.decorator";
import { OwnerGuard } from "../auth/guards/owner.guard";
import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Put,
  ValidationPipe,
  UsePipes,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import { UserService } from "./user.service";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { RequestUser } from "./request-user.interface";
import { User } from "./user.entity";
import { QueryFailedError } from "typeorm";
import { Achievements } from "src/achievement/achievement";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";
// the code for each function can be found in:
// user.service.ts

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  /* default Get - go to localhost:3000/user it displays all users */
  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers() {
    return this.userService.getAllUsersPartial();
  }

  /* retrieves current user from jwt auth cookie */
  @Get("current")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@currentUser() user: User) {
    this.logger.log(`Retrieving details of current user: ${user.id}`);
    // JwtAuthGuard already calls userService.findUserById
    // so we don't call it again.
    return user;
  }

  /* localhost:3000/user/{an+id} - show user based on the id provided */
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findUserById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Get("player/:playerName")
  @UseGuards(JwtAuthGuard)
  async findUserByPlayerName(@Param("playerName") playerName: string) {
    return await this.userService.findUserByPlayerName(playerName);
  }

  /* deletes the user based on the id given when a delete request is made */
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerGuard)
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  /* localhost:3000/user/create - a user can be created */
  @Post("create")
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(":id/update-settings")
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerGuard)
  @UsePipes(ValidationPipe)
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() userSettings: UpdateUserSettingsDto,
  ) {
    this.logger.log("Hit the updateUser route");
    try {
      return await this.userService.updateUser(id, userSettings);
    } catch (error) {
      if (error instanceof QueryFailedError) this.logger.error(error.message);
      throw new HttpException(
        "Player name already exists",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**********
   * STATUS *
   **********/

  @Put(":id/update-status")
  @UsePipes(ValidationPipe)
  async updateUserStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    this.logger.log("Hit the updateStatus route");
    try {
      return await this.userService.updateUserStatus(id, updateUserStatusDto);
    } catch (error) {
      if (error instanceof QueryFailedError) this.logger.error(error.message);
      throw new HttpException(
        "Updating user status failed",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**********
   * AVATAR *
   **********/

  @Post(":id/avatar")
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerGuard)
  @UseInterceptors(FileInterceptor("file"))
  async addAvatar(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log("Hit the addAvatar route");
    if (file) await this.userService.addAchievement(id, Achievements.AVATAR);
    file.filename = "avatar" + "-" + id + "-" + Date.now();
    this.logger.debug(file.filename);
    return await this.userService.addAvatar(id, file.buffer, file.filename);
  }

  @Get(":id/avatar")
  @UseGuards(JwtAuthGuard)
  async getAvatar(
    @Param("id", ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log("Hit the getAvatar route");
    const user = await this.findUserById(id);
    if (user != null) {
      const avatarId = user.avatarId;
      if (!avatarId) {
        return await this.userService.getDefaultAvatar(res);
      } else return await this.userService.getAvatarById(avatarId, res);
    } else {
      this.logger.debug("User not found");
      throw new NotFoundException("User not found");
    }
  }

  /****************
   * ACHIEVEMENTS *
   ****************/

  @Get(":id/achievements")
  async getAchievements(@Param("id", ParseIntPipe) id: number) {
    this.logger.log("Hit the getAchievements route");
    return await this.userService.getAchievements(id);
  }
}
export { RequestUser };
