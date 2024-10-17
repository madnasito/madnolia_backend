import { Expose } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsMongoId, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class UserDto {

    @IsMongoId()
    @IsOptional()
    @Expose()
    _id: string;

    @IsString()
    @Expose()
    name: string;

    @IsString()
    @Expose()
    @Matches(RegExp(/^[a-z0-9-_@]+$/))
    username: string;

    @IsEmail()
    @Expose()
    email: string;

    @IsArray()
    @Expose()
    platforms: Array<Number>

    @IsUrl()
    @Expose()
    img: string;

    @IsUrl()
    @Expose()
    thumb: string;

    @IsArray()
    @Expose()
    partners: Array<string>

    @IsInt()
    @Expose()
    availability: number

    @IsInt()
    @Expose()
    notifications: number;
}