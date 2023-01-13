import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { currentUser } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { IntraAuthGuard } from "./guards/intra-auth.guard";
import { User } from "../user/user.entity";

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
  // gets cookie just to test routes, does not create user in db
  @Get("test_login")
  async testLogin(@Res({ passthrough: true }) response: Response) {
    const authCookie = this.authService.getCookieWithJwtToken(0); // assigns special id 0
    response.setHeader("Set-Cookie", authCookie);
    console.log("testLogin: Set access_token cookie");
    response.status(200).redirect(`${process.env.HOME_REDIRECT}`);
  }

  // gets cookie for user with specified id
  // for testing routes as a specific user
  @Get("test_login/:id")
  @UsePipes(ValidationPipe)
  async testLoginWithId(
    @Param("id", ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authCookie = this.authService.getCookieWithJwtToken(id);
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
  currentAuthenticatedUser(@currentUser() user: User) {
    console.log("Current authenticated user: ", user);
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
