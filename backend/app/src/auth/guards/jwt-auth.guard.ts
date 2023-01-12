import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// saves repetition of jwt authguard
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // temporary admin bypass. TODO: remove
    if (process.env.BYPASS_AUTH === "1") {
      console.log("Bypassing auth");
      return true;
    }

    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
