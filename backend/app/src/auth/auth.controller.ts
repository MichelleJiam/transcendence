import { Controller, Get, Redirect, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "./auth.service";
import { currentUser } from "../user/current-user.decorator";
import { User } from "../user/user.entity";
import { IntraAuthGuard } from "./intra-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login/intra")
  @UseGuards(IntraAuthGuard)
  @Redirect(process.env.INTRA_REDIRECT, 302)
  async loginIntra(@currentUser() user: User) {
    console.log("User logged in: ", user.id);
    return {
      id: user.id,
      token: this.authService.getJwtToken(user),
    };
  }

  @Get("test")
  @UseGuards(JwtAuthGuard)
  async getProfile(@currentUser() user: User) {
    console.log("User is authenticated");
    return user;
  }

  @Get("logout")
  async logout(@currentUser() user: User) {
    console.log("User logged out");
  }
}
