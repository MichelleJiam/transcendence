import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

// Guard that checks if current user's id is same as passed id.
// Use to protect user-specific routes like settings update.
@Injectable()
export class CurrentUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    console.log(
      "CurrentUserGuard id check returns ",
      req.user.id === req.params.id,
    );
    return req.user.id === req.params.id;
  }
}
