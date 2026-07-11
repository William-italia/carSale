import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponseDto } from '@src/auth/dtos/auth-response.dto';
import { extractTokenFromHeader } from '@src/common/utils/extract-token.util';
import type { Request } from 'express';
import accessConfig from './config/access.config';
import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from '@src/auth/dtos/token-payload.dto';
import { UserMapper } from '@src/users/mappers/user-mapper';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { UserEntity } from '@src/users/entities/user.entity';
import { randomUUID } from 'crypto';
import { ICryptoService } from '@src/cryptography/crypto.service';

@Injectable()
export class TokenService {
  constructor(
    @Inject(accessConfig.KEY)
    private readonly accessConfiguration: ConfigType<typeof accessConfig>,

    @Inject(refreshConfig.KEY)
    private readonly refreshConfiguration: ConfigType<typeof accessConfig>,

    private readonly jwtService: JwtService,

    private readonly crypto: ICryptoService,

    private readonly userRepository: UsersRepository,
  ) {}

  async refresh(req: Request): Promise<unknown> {
    const refreshTokenFront = extractTokenFromHeader(req);
    if (!refreshTokenFront) throw new BadRequestException('Invalid token');

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        refreshTokenFront,
        this.refreshConfiguration,
      );

      const user = await this.userRepository.findById(payload.sub);
      if (!user) throw new UnauthorizedException('Invalid token');

      await this.verifyRefreshToken(user, refreshTokenFront);

      return this.rotateTokens(user);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  }

  private async verifyRefreshToken(user: UserEntity, refreshToken: string) {
    
    if (!user.tokenHash) {
      throw new UnauthorizedException('No refresh token stored');
    }

    const isValid = this.crypto.compare(refreshToken, user.tokenHash);

    if (!isValid) {
      await this.userRepository.update(user, {
        tokenHash: null,
      });

      throw new UnauthorizedException('Invalid token verify');
    }
  }

  async rotateTokens(user: UserEntity): Promise<AuthResponseDto> {

    const tokens = await this.createTokens(user);

    await this.userRepository.update(user, {
      tokenHash: this.crypto.hash(tokens.refreshToken),
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: UserMapper.toResponseDto(user),
    };
  }

  async createTokens(user: UserEntity) {
    const accessToken = await this.jwtService.signAsync<TokenPayloadDto>(
      {
        sub: user.id,
        roles: [user.role],
      },
      {
        ...this.accessConfiguration,
      },
    );

    const refreshToken = await this.jwtService.signAsync<TokenPayloadDto>(
      {
        sub: user.id,
        roles: [user.role],
        jti: randomUUID(),
      },
      {
        ...this.refreshConfiguration,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
