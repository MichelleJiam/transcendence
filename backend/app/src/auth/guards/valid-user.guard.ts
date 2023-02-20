import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

// Use when you don't want other auth checks (jwt/intra/owner role),
// but need to access current user from the request
// (e.g. using currentUser decorator).
@Injectable()
export class ValidUserGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // // fill in request.user object if necessary, for currentUser decorator
    await this.authService.getRequestWithUser(context);
    return true;
  }
}
