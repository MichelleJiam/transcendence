import { ValidUserGuard } from "../auth/guards/valid-user.guard";
import { TwoFactorAuthCodeDto } from "./twofactor-auth-code.dto";
import { currentUser } from "./../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TwoFactorAuthService } from "./twofactor-auth.service";
import { User } from "../user/user.entity";
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post("register")
  @UseGuards(JwtAuthGuard)
  async register(@Res() response: Response, @currentUser() user: User) {
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);

    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
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
  }

  @Post("disable")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async disableTwoFactorAuth(@currentUser() user: User) {
    await this.twoFactorAuthService.disableTwoFactor(user);
  }

  @Post("authenticate")
  @HttpCode(200)
  @UseGuards(ValidUserGuard)
  async authenticate(
    @currentUser() user: User,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    console.log("2FA Authenticate for user ", user.id);
    await this.validateCode(user, twoFactorAuthCode);

    // const authCookie = this.authService.getCookieWithJwtToken(user.id);
    // response.setHeader("Set-Cookie", authCookie);
  }

  private async validateCode(user: User, twoFactorAuthCode: string) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException("Wrong authentication code");
    }
  }

  // DEBUG // TODO: remove
  @Get("test")
  @UseGuards(JwtAuthGuard)
  async test(@currentUser() user: User) {
    console.log("2FA test user ", user.id);
  }
}
