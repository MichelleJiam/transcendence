import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "./auth.service";
import { currentUser } from "../user/current-user.decorator";
import { User } from "../user/User.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  // @UseGuards(AuthGuard("local"))
  async login(@currentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.jwtLogin(user),
    };
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@currentUser() user: User) {
    return user;
  }
}
