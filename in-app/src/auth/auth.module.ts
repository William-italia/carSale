import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { CryptographyModule } from '@src/cryptography/cryptography.module';
import { BcryptHash } from '@src/cryptography/bcrypt-hash.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    UsersModule,
    CryptographyModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [AuthService, BcryptHash],
  controllers: [AuthController],
})
export class AuthModule {}
