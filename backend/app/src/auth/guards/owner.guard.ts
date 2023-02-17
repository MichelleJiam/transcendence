import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { User } from "src/user/user.entity";
import { RequestUser } from "src/user/request-user.interface";

// Guard that checks if current user's id is same as passed id.
// Use to protect user-specific routes like settings update.
@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestUser = context.switchToHttp().getRequest();
    const passedId: number = parseInt(req.params.id);

    // fill in request.user object if necessary, for currentUser decorator
    const currentUser: User = await this.authService.fillRequestUserIfAbsent(
      req,
    );

    console.log(
      "CurrentUserGuard id check returns ",
      currentUser.id === passedId,
      " user id: ",
      currentUser.id,
      " trying to access resource of user ",
      req.params.id,
    );
    return currentUser.id === passedId;
  }
}
