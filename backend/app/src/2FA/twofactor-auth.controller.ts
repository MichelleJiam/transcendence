import { currentUserFromBody } from "./../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TwoFactorAuthService } from "./twofactor-auth.service";
import { User } from "../user/user.entity";
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post("generate")
  @UseGuards(JwtAuthGuard)
  async register(@Res() response: Response, @currentUserFromBody() user: User) {
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);

    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
  }
}
