import {
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
import { UserEntity } from '@src/users/entities/user.entity';
import { TokenPayloadDto } from './dtos/token-payload.dto';
import { UserMapper } from '@src/users/mappers/user-mapper';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { TokenService } from '@src/security/token.service';
import { IBcryptService } from '@src/cryptography/bcrypt.service';
import { ICryptoService } from '@src/cryptography/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly crypto: ICryptoService,
    private readonly bcrypt: IBcryptService,
    private readonly tokenService: TokenService,
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

  async signIn(dto: LoginAuthDto): Promise<AuthResponseDto> {
    const user = await this.validateCredentials(dto);
    const tokens = await this.tokenService.createTokens(user);


     await this.userRepository.update(user, {
      tokenHash: this.crypto.hash(tokens.refreshToken),
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: UserMapper.toResponseDto(user),
    };
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
}
