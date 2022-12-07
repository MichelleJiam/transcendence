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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname, parse } from "path";
import { CreateUserDto } from "./dto/create_user.dto";
import { UpdateUserSettingsDto } from "./dto/update_user_settings.dto";
import { UserService } from "./user.service";
import { diskStorage } from "multer";
import { AvatarService } from "src/avatar/avatar.service";
import { get } from "http";
import { Avatar } from "src/avatar/avatar.entity";
import { Request } from "express";

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

	@Get(":id/avatar")
	getAvatar(@Param("id", ParseIntPipe) id: number) {
		return this.avatarService.getAvatar(id);
	}

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

	/* ------------------------------------------------------------- */

	/* http://localhost:3000/user/upload-avatar */
	// uploads a simple .txt file to the /files folder for now, nothing done in frontend yet
	// curl -X POST -F 'file=@upload.txt' http://localhost:3000/user/upload-avatar

	// @Post("upload-avatar")
	// @UseInterceptors(
	// 	FileInterceptor("file", {
	// 		storage: diskStorage({
	// 			destination: "./files",
	// 			filename: (req, file, callback) => {
	// 				const uniqueSuffix =
	// 					Date.now() + "-" + Math.round(Math.random() * 1e9);
	// 				const ext = extname(file.originalname);
	// 				const filename = `${uniqueSuffix}${ext}`;
	// 				callback(null, filename);
	// 			},
	// 		}),
	// 	})
	// )
	// uploadAvatar(@UploadedFile() file: Express.Multer.File) {
	// 	console.log(file);
	// 	return "File upload API";
	// }
}
