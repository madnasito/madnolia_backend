import { IsAlphanumeric, IsArray, IsEmail, IsLowercase, isLowercase, IsString, IsStrongPassword, Matches } from "class-validator";

export class CreateUserDto {

    @IsAlphanumeric()
    name: string;

    @IsAlphanumeric()
    @IsLowercase()
    @Matches(/^[a-z0-9-_@]+$/)
    username: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
    
    @IsArray()
    platforms: [];
    

}