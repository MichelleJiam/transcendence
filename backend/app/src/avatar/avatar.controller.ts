import { Controller, Get } from "@nestjs/common";
import { AvatarService } from "./avatar.service";

// Avatar controller we probably don't need, this happens in user.controller.ts

@Controller("avatar")
export class AvatarController {
	constructor(private AvatarService: AvatarService) {}
	// @Get("/")
	// getAvatar() {
	// 	return this.AvatarService.getAvatar();
	// }
}
