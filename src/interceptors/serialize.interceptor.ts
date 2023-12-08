import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserDto } from "../users/dtos/user.dto";
import { plainToClass } from "class-transformer";


interface ClassConstructor {
    new (...args: any[]): object
}

export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
        ): Observable<any> | Promise<Observable<any>> {
        
            return next.handle().pipe(
                map((data: any) => {
                    return plainToClass(this.dto, data, {
                        excludeExtraneousValues: true,
                    })
                })
            )
    }
}