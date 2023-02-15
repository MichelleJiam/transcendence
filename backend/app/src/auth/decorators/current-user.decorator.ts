import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const currentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);

// used by twofactor-auth.controller to extract user for generating secret.
// currentUser gives undefined when trying to access properties
export const currentUserFromBody = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.body?.[data] : request.body;
  },
);
