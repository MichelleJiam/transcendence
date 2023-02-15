import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";
import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";
import { Response } from "express";

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly userService: UserService) {}

  public async generateTwoFactorAuthSecret(user: User) {
    console.log("Generating 2FA secret for user ", user);
    const secret = authenticator.generateSecret();
    const appName = process.env.TWOFA_APP_NAME ?? "Pong";
    const otpauthUrl = authenticator.keyuri(user.intraId, appName, secret);

    await this.userService.setTwoFactorSecret(secret, user.id);

    return { secret, otpauthUrl };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}
