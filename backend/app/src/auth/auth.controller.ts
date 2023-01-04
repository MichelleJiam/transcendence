import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "./auth.service";
import { currentUser } from "../user/current-user.decorator";
import { User } from "../user/user.entity";
import { use } from "passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login/intra")
  // @UseGuards(IntraAuthGuard)
  async loginIntra(@currentUser() user: User) {
    return this.authService.validateUser(user);
  }

  // @Get("profile")
  // // @UseGuards(IntraAuthGuard)
  // async getProfile(@currentUser() user: User) {
  //   return user;
  // }
}
