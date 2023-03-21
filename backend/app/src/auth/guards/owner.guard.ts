import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

// Guard that checks if current user's id is same as passed id.
// Use to protect user-specific routes like settings update.
@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await this.authService.getRequestWithUser(context);
    const passedId: number = parseInt(req.params.id);
    const currentUser = req.user;

    return currentUser.id === passedId;
  }
}
