import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


@Injectable()
export class authGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
    ) {}


    async canActivate(context: ExecutionContext): Promise<boolean>  {
        
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request)
        
        if(!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException('Credentials not found!');  
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authAutorization = request.headers.authorization;

        if(!authAutorization) {
            return undefined
        }

        const [type, token] = authAutorization.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }

}