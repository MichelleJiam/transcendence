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

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login")
  @UseGuards(IntraAuthGuard)
  async loginIntra() {
    // console.log("User logged in: ", user.id);
  }

  @Get("callback")
  @UseGuards(IntraAuthGuard)
  async callback(
    @Res({ passthrough: true }) response: Response, // enabling passthrough lets Nest handle response logic
    @currentUser() user: User,
  ) {
    console.log("Callback");
    const authCookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader("Set-Cookie", authCookie);
    console.log("callback: Set access_token cookie");
    response.status(200).redirect(`${process.env.HOME_REDIRECT}`);
    // return { id: user.id };
  }

  // Debug routes. TODO: remove later
  @Get("test_login")
  async testLogin(@Res({ passthrough: true }) response: Response) {
    const authCookie = this.authService.getCookieWithJwtToken(0);
    response.setHeader("Set-Cookie", authCookie);
    console.log("testLogin: Set access_token cookie");
    response.status(200).redirect(`${process.env.HOME_REDIRECT}`);
  }

  @Get("test_access")
  @UseGuards(JwtAuthGuard)
  async testAccess(@currentUser() user: User) {
    console.log("User can access jwt-protected route");
    return user;
  }

  @Get("test_cookie")
  @UseGuards(JwtAuthGuard)
  async testCookie(@Req() request: Request, @currentUser() user: User) {
    console.log(
      "testCookie (Authentication): ",
      request?.cookies?.Authentication,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@currentUser() user: User) {
    return user;
  }
  // end of debug methods

  // @Post("logout")
  @Get("logout") // temporary for testing in browser
  @UseGuards(JwtAuthGuard)
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
