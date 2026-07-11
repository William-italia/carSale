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
import accessConfig from './config/access.config';
import { TOKEN_PAYLOAD_KEY } from './security.constants';
import { extractTokenFromHeader } from '@src/common/utils/extract-token.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(accessConfig.KEY)
    private readonly accessConfiguration: ConfigType<typeof accessConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(req);

    if (!token) throw new UnauthorizedException('Not connected!');

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        token,
        this.accessConfiguration,
      );

      req[TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }

    return true;
  }
}
