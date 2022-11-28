import { Controller, Post, Get, Body, Param, ParseIntPipe, Delete } from "@nestjs/common";
import { CreateUserDto } from "./dto/create_user.dto";
import { UserService } from "./user.service";

// the code for each function can be found in:
// user.service.ts

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	/* default Get - go to localhost:3000/user it displays all users */
	@Get()
	getAllUsers() {
		return this.userService.getAllUsers();
	}

	/* localhost:3000/user/id/{an+id} - show user based on the id provided */
	@Get('id/:id')
	findUsersById(@Param('id', ParseIntPipe) id: number) {
		return this.userService.findUserById(id);
	}

	/* localhost:3000/user/{username}/messages - show all messages by specified user */
	@Get(':username/messages')
	getUserMessages(@Param('username') username: string) {
		return this.userService.getUserMessages(username);
	}
	
	/* deletes the user based on the id given when a delete request is made */
	@Delete('id/:id')
	deleteUser(@Param('id', ParseIntPipe) id: number){
		return this.userService.deleteUser(id);
	}

	/* localhost:3000/user/create - a user can be created */
	@Post('create')
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
}
