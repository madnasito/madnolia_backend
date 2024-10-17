import { Expose } from "class-transformer";
import { IsJWT, IsObject } from "class-validator";
import { UserDto } from "src/users/dtos/user.dto";

export class AuthResponseDto {
    @Expose()
    @IsObject()
    user:UserDto

    @Expose()
    @IsJWT()
    token: string;
}