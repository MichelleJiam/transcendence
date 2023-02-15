import { TwoFactorAuthService } from "./twofactor-auth.service";
import { TwoFactorAuthController } from "./twofactor-auth.controller";
import { UserModule } from "../user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [UserModule],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService],
})
export class TwoFactorModule {}
