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
	UseInterceptors,
	UploadedFile,
	Req,
	Res,
	StreamableFile,
	Header,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname, parse } from "path";
import { CreateUserDto } from "./dto/create_user.dto";
import { UpdateUserSettingsDto } from "./dto/update_user_settings.dto";
import { UserService } from "./user.service";
// import { diskStorage } from "multer";
import { AvatarService } from "src/avatar/avatar.service";
import { get } from "http";
import { Avatar } from "src/avatar/avatar.entity";
import { Request } from "express";
import { Readable } from "typeorm/platform/PlatformTools";
import { Response } from "express";
import { createReadStream } from "fs";
import { join } from "path";

// the code for each function can be found in:
// user.service.ts

@Controller("user")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly avatarService: AvatarService
	) {}

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

	/* localhost:3000/user/{username}/messages - show all messages by specified user */
	@Get(":username/messages")
	getUserMessages(@Param("username") username: string) {
		return this.userService.getUserMessages(username);
	}

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
	// curl -i --header "Content-Type: application/json" --request PUT --data '{"username":"Nilo"}' http://localhost:3000/user/3/update-settings

	@Put(":id/update-settings")
	@UsePipes(ValidationPipe)
	async updateUser(
		@Param("id", ParseIntPipe) id: number,
		@Body() userSettings: UpdateUserSettingsDto
	) {
		return await this.userService.UpdateUser(id, userSettings);
	}

	/* localhost:3000/user/id/avatar */
	// curl -X POST -H 'Content-Type: multipart/form-data' -F 'file=@cat-gf6fa74711_640.jpg' http://localhost:3000/user/2/avatar

	// @Get(":id/avatar")
	// getAvatar(@Param("id", ParseIntPipe) id: number) {
	// 	return this.avatarService.getAvatar(id);
	// }

	// @Put(":id/avatar")
	// async updateAvatar(
	// 	@Param("id", ParseIntPipe) id: number,
	// 	@Body() avatar: Avatar
	// ) {}

	@Post(":id/avatar")
	@UseInterceptors(FileInterceptor("file"))
	async addAvatar(
		@Param("id", ParseIntPipe) id: number,
		@UploadedFile() file: Express.Multer.File
	) {
		file.filename = "avatar" + Math.random();
		return this.userService.addAvatar(id, file.buffer, file.filename);
	}

	@Get(":id/avatar")
	@Header("Content-Type", "image")
	@Header("Content-Disposition", 'attachment; filename="filename.jpg"')
	async getAvatar(
		@Param("id", ParseIntPipe) id: number
		// @Res({ passthrough: true }) res: Response
	) {
		const user = this.findUsersById(id);
		const avatarId = (await user).avatarId;

		if (avatarId == null) {
			const defaultAvatar = createReadStream(
				join(process.cwd(), "src/assets/default-avatar.png")
			);
			return new StreamableFile(defaultAvatar);
		}
		const file = await this.userService.getAvatarById(avatarId);
		const stream = Readable.from(file.data);
		// res.set({
		// 	"Content-Disposition": `inline; filename="${file.filename}"`,
		// 	"Content-Type": "image",
		// });
		return new StreamableFile(stream);
	}
}
