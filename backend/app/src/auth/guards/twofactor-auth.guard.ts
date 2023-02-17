import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { RequestUser } from "src/user/request-user.interface";

@Injectable()
export class TwoFactorAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestUser = context.switchToHttp().getRequest();
    // fill in request.user object if necessary, for currentUser decorator
    await this.authService.fillRequestUserIfAbsent(req);
    return true;
  }
}
