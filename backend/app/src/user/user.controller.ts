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
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import { UserService } from "./user.service";
import { createReadStream } from "fs";
import { join } from "path";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { Readable } from "typeorm/platform/PlatformTools";
// the code for each function can be found in:
// user.service.ts

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* default Get - go to localhost:3000/user it displays all users */
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  /* localhost:3000/user/id/{an+id} - show user based on the id provided */
  @Get("id/:id")
  findUsersById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  /* localhost:3000/user/{an+id}/messages - show all messages by specified user */
  // @Get(":id/messages")
  // getUserMessages(@Param("id", ParseIntPipe) id: number) {
  //   return this.userService.getUserMessages(id);
  // }

  /* deletes the user based on the id given when a delete request is made */
  @Delete("id/:id")
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  /* localhost:3000/user/create - a user can be created */
  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /* localhost:3000/user/:id/update-settings */
  /* curl -i --header "Content-Type: application/json" --request PUT --data '{"username":"Nilo"}' http://localhost:3000/user/3/update-settings */

  /* TODO:
   **  add server-side validation for user input
   */

  @Put(":id/update-settings")
  @UsePipes(ValidationPipe)
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() userSettings: UpdateUserSettingsDto,
  ) {
    return await this.userService.updateUser(id, userSettings);
  }

  /* avatar */

  @Post(":id/avatar")
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
  async getAvatar(
    @Param("id", ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.findUsersById(id);
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
