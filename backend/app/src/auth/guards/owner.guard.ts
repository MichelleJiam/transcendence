import { RequestUser } from "../../user/user.controller";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

// Guard that checks if current user's id is same as passed id.
// Use to protect user-specific routes like settings update.
@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    console.log("CurrentUserGuard");
    const req: RequestUser = context.switchToHttp().getRequest();
    const passedId: number = parseInt(req.params.id);
    const jwtFromRequest = req.cookies.Authentication;
    // console.log("jwt cookie: ", jwtFromRequest);
    const decoded = this.jwtService.decode(jwtFromRequest);
    console.log("decoded id: ", decoded);
    // console.log("req: ", req.user);
    console.log(
      "CurrentUserGuard id check returns ",
      decoded?.sub === passedId,
      " user id: ",
      decoded?.sub,
      " trying to access resource of user ",
      req.params.id,
    );
    return decoded?.sub === passedId;
  }
}

// @Injectable()
// export class OwnerGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}
//   canActivate(context: ExecutionContext): boolean {
//     console.log("CurrentUserGuard");
//     const req: RequestUser = context.switchToHttp().getRequest();
//     const passedId: number = parseInt(req.params.id);
//     const currentUserId = this.authService.getUserIdFromRequestAuthCookie(req);
//     console.log(
//       "CurrentUserGuard id check returns ",
//       currentUserId === passedId,
//       " user id: ",
//       currentUserId?.sub,
//       " trying to access resource of user ",
//       req.params.id,
//     );
//     return currentUserId === passedId;
//   }
// }
