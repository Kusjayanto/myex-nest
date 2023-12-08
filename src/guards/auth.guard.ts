import { CanActivate, ExecutionContext } from "@nestjs/common/interfaces";

export class AuthGuard implements CanActivate {
    canActivate(ctx: ExecutionContext) {
        const req = ctx.switchToHttp().getRequest();
        return req.session.userId;
    }
}