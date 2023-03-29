import { Controller, Get, Logger, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { currentUser } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { IntraAuthGuard } from "./guards/intra-auth.guard";
import { User } from "../user/user.entity";
import { TokenType } from "./token-payload.interface";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get("login")
  @UseGuards(IntraAuthGuard)
  async loginIntra() {
    this.logger.log("Hit auth login");
  }

  @Get("callback")
  @UseGuards(IntraAuthGuard)
  async callback(
    @Res({ passthrough: true }) response: Response, // enabling passthrough lets Nest handle response logic
    @currentUser() user: User,
  ) {
    this.logger.log("Hit auth callback");
    let redirectTo, authCookie;

    // Issue partial access cookie if 2FA needed.
    if (user.twoFAEnabled === true) {
      authCookie = this.authService.getCookieWithJwtToken(
        user.id,
        user.intraId,
        TokenType.PARTIAL,
      );
      redirectTo = `${process.env.FRONTEND_URL}/2fa`;
      this.logger.log("2FA required, redirecting to 2FA frontend");
    } else {
      authCookie = this.authService.getCookieWithJwtToken(
        user.id,
        user.intraId,
      );
      redirectTo = `${process.env.FRONTEND_URL}/login`;
    }
    response.setHeader("Set-Cookie", authCookie);
    this.logger.log(`redirecting to ${redirectTo}`);
    response.status(200).redirect(redirectTo);
  }

  // Returns user if current user is authenticated.
  @UseGuards(JwtAuthGuard)
  @Get("status")
  checkAuthentication(@currentUser() user: User) {
    this.logger.log(`Confirming authenticated status of user ${user.id}`);
    return user;
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @currentUser() user: User,
  ) {
    this.logger.log(`User logging out: ${user}`);
    response.clearCookie("Authentication");
    response.status(200);
  }
}
