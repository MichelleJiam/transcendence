import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { authenticator } from "otplib";
import { toDataURL, toFileStream } from "qrcode";
import { Response } from "express";

@Injectable()
export class TwoFactorAuthService {
  private readonly logger = new Logger(TwoFactorAuthService.name);
  constructor(private readonly userService: UserService) {}

  async generateTwoFactorAuthSecret(
    user: User,
  ): Promise<{ secret: string; otpauthUrl: string }> {
    this.logger.log(`Generating 2FA secret for user ${user}`);
    const secret = authenticator.generateSecret();
    const appName = process.env.TWOFA_APP_NAME ?? "Pong";
    const otpauthUrl = authenticator.keyuri(user.intraId, appName, secret);

    await this.userService.setTwoFactorSecret(secret, user.id);
    return { secret: secret, otpauthUrl: otpauthUrl };
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async getQrCodeAsDataUrl(otpauthUrl: string) {
    return await toDataURL(otpauthUrl);
  }

  isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
    if (!user.twoFASecret || user.twoFASecret.length < 1) {
      throw new BadRequestException("2FA: user has not registered a secret");
    }
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFASecret,
    });
  }

  async enableTwoFactor(user: User) {
    await this.userService.updateUser(user.id, { ...user, twoFAEnabled: true });
  }

  async disableTwoFactor(user: User) {
    await this.userService.updateUser(user.id, {
      ...user,
      twoFAEnabled: false,
      twoFASecret: "",
    });
  }
}
