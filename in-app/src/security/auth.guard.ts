import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { Request } from "express";
import jwtConfig from "./config/jwt.config";
import { JwtService } from "@nestjs/jwt";
import { TokenPayloadDto } from "@src/auth/dtos/token-payload.dto";
import { TOKEN_PAYLOAD_KEY } from "@src/security/auth.constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if(!token) {
            throw new UnauthorizedException('Not connected');
        }

        try {
            
            const payload = await this.jwtService.verifyAsync<TokenPayloadDto>
            (
                token, 
                this.jwtConfiguration
            );

            request[TOKEN_PAYLOAD_KEY] = payload;

        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Login failed');   
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authAutorization = request.headers?.authorization;

        if(!authAutorization || typeof authAutorization !== 'string') {
            return;
        }

        const [type, token] = authAutorization.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }

}