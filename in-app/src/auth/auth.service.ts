import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UsersService } from '@src/users/users.service';
import { EmailValidationDto } from './dtos/email-auth.dto';
import { UpdatePasswordDto } from '@src/users/dtos/update-password.dto';
import { BcryptHash } from '@src/cryptography/bcrypt-hash.service';
import { UserEntity } from '@src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dtos/token-payload.dto';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly bcrypt: BcryptHash,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: RegisterAuthDto): Promise<void> {
    await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      confirmPassword: dto.confirmPassword,
    });

    // TODO: generate token and send email for verify
    return;
  }

  async signIn(dto: LoginAuthDto): Promise<{ access_token: string }> {
    const user = await this.validateCredentials(dto);

    // TODO
    // const refreshToken = 'yyyy';

    const accessToken = await this.jwtService.signAsync<TokenPayloadDto>(
      {
        sub: user.id,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
      },
    );

    return {
      access_token: accessToken,
    };
  }



  async forgotPassword(dto: EmailValidationDto): Promise<string> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // TODO: generate reset token and send email
    return `Bearer ${user.id}`;
  }

  async resetPassword(
    payload: TokenPayloadDto,
    dto: UpdatePasswordDto,
  ): Promise<void> {
    await this.usersService.updateUserPassword(payload.sub, dto);
  }

  private async validateCredentials(dto: LoginAuthDto): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
