import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from '@src/auth/dtos/token-payload.dto';
import { Request } from 'express';
import jwtConfig from './config/jwt.config';
import { TOKEN_PAYLOAD_KEY } from './security.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (!token) throw new UnauthorizedException('Not connected!');

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        token,
        this.jwtConfiguration,
      );

      req[TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Login failed');
    }

    return true;
  }

  private extractTokenFromHeader(req: Request) {
    const authAutorization = req.headers?.authorization;

    if (!authAutorization || typeof authAutorization !== 'string') return;

    const [type, token] = authAutorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
