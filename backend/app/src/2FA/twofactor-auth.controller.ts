import { TwoFactorAuthCodeDto } from "./twofactor-auth-code.dto";
import { currentUser } from "./../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TwoFactorAuthService } from "./twofactor-auth.service";
import { User } from "../user/user.entity";
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "src/auth/auth.service";
import PartialJwtGuard from "src/auth/guards/partial-jwt.guard";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly authService: AuthService,
  ) {}

  @Post("register")
  @UseGuards(JwtAuthGuard)
  async register(
    @Res() response: Response,
    @currentUser() user: User,
  ): Promise<string | void> {
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);
    const qrCode = await this.twoFactorAuthService.getQrCodeAsDataUrl(
      otpauthUrl,
    );
    response.send(qrCode);
  }

  @Post("enable")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async enableTwoFactorAuth(
    @currentUser() user: User,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    await this.validateCode(user, twoFactorAuthCode);
    await this.twoFactorAuthService.enableTwoFactor(user);
    console.log("2FA has been enabled");
  }

  @Post("disable")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async disableTwoFactorAuth(@currentUser() user: User) {
    await this.twoFactorAuthService.disableTwoFactor(user);
    console.log("2FA has been disabled");
  }

  @Post("authenticate")
  @HttpCode(200)
  @UseGuards(PartialJwtGuard)
  async authenticate(
    @currentUser() user: User,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log("2FA Authenticate for user ", user.id);
    await this.validateCode(user, twoFactorAuthCode);

    const authCookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader("Set-Cookie", authCookie);
  }

  private async validateCode(user: User, twoFactorAuthCode: string) {
    // console.log(
    //   "Attempting to validate code [",
    //   twoFactorAuthCode,
    //   "] for user ",
    //   user.id,
    // );
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException("2FA: wrong authentication code");
    }
  }
}
