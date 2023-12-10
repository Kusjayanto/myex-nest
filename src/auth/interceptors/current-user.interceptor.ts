import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService) {}

    async intercept(ctx: ExecutionContext, next: CallHandler) {
        console.log('Interceptor: CurrentUser - Mulai');

        const request = ctx.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if (userId) {
            console.log('Interceptor: CurrentUser - userId ditemukan:', userId);

            try {
                const user = await this.userService.findOneBy(userId);
                console.log('Interceptor: CurrentUser - User ditemukan:', user);

                // Set currentUser pada objek request
                request.currentUser = user;
            } catch (error) {
                console.error('Interceptor: CurrentUser - Error saat mencari user:', error);
                // Tangani error sesuai kebutuhan Anda
            }
        } else {
            console.log('Interceptor: CurrentUser - userId tidak ditemukan');
        }

        console.log('Interceptor: CurrentUser - Selesai');

        return next.handle();
    }
}
