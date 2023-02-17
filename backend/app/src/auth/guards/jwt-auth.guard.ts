import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestUser } from "src/user/request-user.interface";
import { AuthService } from "../auth.service";

// saves repetition of jwt authguard
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;

    // fill in request.user object if necessary, for currentUser decorator
    const req: RequestUser = context.switchToHttp().getRequest();
    await this.authService.fillRequestUserIfAbsent(req);

    return result;
  }
}
