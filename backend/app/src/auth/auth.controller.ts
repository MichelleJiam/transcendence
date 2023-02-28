import {
  Controller,
  Get,
  Logger,
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
import { TokenType } from "./token-payload.interface";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get("login")
  @UseGuards(IntraAuthGuard)
  async loginIntra() {
    console.log("/auth/login endpoint hit");
  }

  @Get("callback")
  @UseGuards(IntraAuthGuard)
  async callback(
    @Res({ passthrough: true }) response: Response, // enabling passthrough lets Nest handle response logic
    @currentUser() user: User,
  ) {
    console.log("Callback");
    let redirectTo, authCookie;

    // Issue partial access cookie if 2FA needed.
    if (user.twoFAEnabled === true) {
      authCookie = this.authService.getCookieWithJwtToken(
        user.id,
        TokenType.PARTIAL,
      );
      redirectTo = `${process.env.HOME_REDIRECT}/2fa`;
      console.log("2FA required, redirecting to 2FA frontend");
    } else {
      authCookie = this.authService.getCookieWithJwtToken(user.id);
      redirectTo = `${process.env.HOME_REDIRECT}/login`;
    }
    response.setHeader("Set-Cookie", authCookie);
    console.log("redirecting to ", redirectTo);
    response.status(200).redirect(redirectTo);
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
  // end of debug methods

  // Returns user if current user is authenticated.
  @UseGuards(JwtAuthGuard)
  @Get("status")
  checkAuthentication(@currentUser() user: User) {
    console.log("Current authenticated user: ", user);
    // if (user.twoFAEnabled === true) {
    //   return "2FA";
    // } else if (user.playerName === null) {
    //   return "SETUP";
    // } else {
    //   return "AUTHENTICATED";
    // }
    return user;
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @currentUser() user: User,
  ) {
    console.log("User logging out: ", user);
    // response.setHeader(
    //   "Set-Cookie",
    //   `Authentication=; HttpOnly; Path=/; Max-Age=0`,
    // );
    response.clearCookie("Authentication");
    response.status(200);
  }
}
