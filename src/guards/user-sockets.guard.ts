
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
  import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
//   import { jwtConstants } from './constants';
  import { Request } from 'express';
@Injectable()

export class UserSocketGuard implements CanActivate {
    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToWs();
        
        const token = this.extractTokenFromHeader(request)
        
        console.log(token);

        if(!token){
            throw new WsException("Invalid credentials")
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                  secret: "hard!to-guess_secret"
                }
              );

              console.log(payload);
              // 💡 We're assigning the payload to the request object here
              // so that we can access it in our route handlers
              request.getClient().user = payload.id;
        
        } catch (error) {
            throw new WsException("Unauthorized");
        }

        return true;
    }

    private extractTokenFromHeader(request: WsArgumentsHost): string | undefined {
      
        const {headers} = request.getClient().handshake


        return headers.token

        // const [type, token] = request.headers.authorization?.split(' ') ?? [];
        // return type === 'Bearer' ? token : undefined;
    }
}