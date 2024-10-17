import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";
import { AuthResponseDto } from "src/auth/dtos/response.dto";

interface ClassConstructor {
    new (...args: any[]): {}
}

export function AuthSerialize(dto: ClassConstructor) {

    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto: ClassConstructor){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        return next.handle().pipe(
            map((data: AuthResponseDto) => {
                return plainToClass(this.dto, data, {
                    
                });
            })
        )
        // throw new Error("Method not implemented.");
    }
    
}