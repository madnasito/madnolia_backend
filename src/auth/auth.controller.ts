import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dtio';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthResponseDto } from './dtos/response.dto';
import { AuthSerialize } from 'src/interceptors/auth.interceptor';

@Controller('auth')

@AuthSerialize(AuthResponseDto)
export class AuthController {

    constructor(private authService: AuthService){}

    @Post("sign-up")
    async signUp(@Body() body: SignUpDto) {
        return await this.authService.signUp(body);
    }

    @Post('sign-in')
    async signin(@Body() body: SignInDto) {
        return await this.authService.signIn(body);
    }
    
}
