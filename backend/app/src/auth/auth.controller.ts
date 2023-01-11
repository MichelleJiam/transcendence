import {
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "./auth.service";
import { currentUser } from "../user/current-user.decorator";
import { User } from "../user/user.entity";
import { IntraAuthGuard } from "./intra-auth.guard";
import { Response } from "express";
import { Request } from "express";
import passport from "passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login")
  @UseGuards(IntraAuthGuard)
  // @Redirect(process.env.HOME_REDIRECT, 302)
  async loginIntra(
    // enabling passthrough lets Nest handle response logic
    @Res({ passthrough: true }) response: Response,
  ) {
    // console.log("User logged in: ", user.id);
  }

  @Get("callback")
  @UseGuards(IntraAuthGuard)
  async callback(
    @Res({ passthrough: true }) response: Response,
    @currentUser() user: User,
  ) {
    console.log("Callback");
    const authCookie = this.authService.getCookieWithJwtToken(user);
    response.setHeader("Set-Cookie", authCookie);
    console.log("callback: Set access_token cookie");
    response.status(200).redirect(`${process.env.HOME_REDIRECT}`);
    // return { id: user.id, authCookie }; // debug
    // return { id: user.id };
  }

  @Get("test")
  @UseGuards(JwtAuthGuard)
  async test(@currentUser() user: User) {
    console.log("User can access jwt-protected route");
    return user;
  }

  @Get("test_cookie")
  @UseGuards(JwtAuthGuard)
  async getCookie(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @currentUser() user: User,
  ) {
    console.log(
      "getCookie (Authentication): ",
      request?.cookies?.Authentication,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@currentUser() user: User) {
    return user;
  }

  @Get("test2")
  @UseGuards(IntraAuthGuard) // reissues jwt token??
  // @UseGuards(AuthenticatedGuard)
  async test2(@currentUser() user: User) {
    console.log("User can access intra-protected route");
    return user;
  }

  // @Post("logout")
  @Get("logout") // temporary for testing in browser
  // @UseGuards(IntraAuthGuard)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @currentUser() user: User,
  ) {
    console.log("User logging out: ", user);
    // response.setHeader(
    //   "Set-Cookie",
    //   `Authentication=; HttpOnly; Path=/; Max-Age=0`,
    // );
    response.clearCookie("Authentication");
    response.status(200).redirect(`${process.env.HOME_REDIRECT}`);
  }
}
