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
  StreamableFile,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import { UserService } from "./user.service";
import { createReadStream } from "fs";
import { join } from "path";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { Readable } from "typeorm/platform/PlatformTools";
import { RequestUser } from "./request-user.interface";
import { User } from "./user.entity";
import PartialJwtGuard from "src/auth/guards/partial-jwt.guard";
import { QueryFailedError } from "typeorm";
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
    return this.userService.getAllUsers();
  }

  /* retrieves current user from jwt auth cookie */
  @Get("current")
  @UseGuards(PartialJwtGuard)
  getCurrentUser(@currentUser() user: User) {
    console.log("Retrieving details of current user: ", user.id);
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
  findUserByPlayerName(@Param("playerName") playerName: string) {
    return this.userService.findUserByPlayerName(playerName);
  }

  /* localhost:3000/user/{an+id}/messages - show all messages by specified user */
  // @Get(":id/messages")
  // getUserMessages(@Param("id", ParseIntPipe) id: number) {
  //   return this.userService.getUserMessages(id);
  // }

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

  /* localhost:3000/user/:id/update-settings */
  /* curl -i --header "Content-Type: application/json" --request PUT --data '{"playerName":"Nilo"}' http://localhost:3000/user/3/update-settings */

  /* TODO:
   **  add server-side validation for user input
   */

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

  // @Put("/update-settings")
  // @UsePipes(ValidationPipe)
  // async updateUser(
  //   @currentUser() user: User,
  //   @Body() userSettings: UpdateUserSettingsDto,
  // ) {
  //   console.log("Current user id: ", user.id);
  //   return await this.userService.updateUser(user.id, userSettings);
  // }

  /* avatar */

  @Post(":id/avatar")
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerGuard)
  @UseInterceptors(FileInterceptor("file"))
  async addAvatar(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // delete avatar before posting a new one
    file.filename = "avatar" + "-" + id + "-" + Date.now();
    return this.userService.addAvatar(id, file.buffer, file.filename);
  }

  @Get(":id/avatar")
  @UseGuards(JwtAuthGuard)
  async getAvatar(
    @Param("id", ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    // add id check here
    const user = await this.findUserById(id);
    if (user != null) {
      const avatarId = user.avatarId;
      if (user.avatarId == null) {
        res.header("Content-Type", "image");
        res.header(
          "Content-Disposition",
          `inline; filename="default-avatar.jpg"`,
        );
        const defaultAvatar = createReadStream(
          join(process.cwd(), "src/assets/default-avatar.png"),
        );
        return new StreamableFile(defaultAvatar);
        // split up into different functions
      } else {
        if (avatarId) {
          const file = await this.userService.getAvatarById(avatarId);
          res.header("Content-Type", "image");
          res.header(
            "Content-Disposition",
            `inline; filename="${file.filename}"`,
          );
          if (file.data) {
            const stream = Readable.from(file.data);
            return new StreamableFile(stream);
          }
        }
      }
    }
  }
}
export { RequestUser };
