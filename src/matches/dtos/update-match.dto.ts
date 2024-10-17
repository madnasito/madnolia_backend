import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateMatchDto {

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsNumber()
    @Min(new Date().getTime())
    date: number;

    @IsOptional()
    @IsBoolean()
    private: boolean


}