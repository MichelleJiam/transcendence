import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

// Guard that checks if current user's id is same as passed id.
// Use to protect user-specific routes like settings update.
@Injectable()
export class CurrentUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    console.log("req: ", req);
    console.log(
      "CurrentUserGuard id check returns ",
      req.user.id === req.params.id,
      " user id: ",
      req.user.id,
      " trying to access resource of user ",
      req.params.id,
    );
    return req.user.id === req.params.id;
  }
}
