import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { CryptographyModule } from '@src/cryptography/cryptography.module';
import { SecurityModule } from '@src/security/security.module';
import { TokenService } from '@src/security/token.service';

@Module({
  imports: [UsersModule, CryptographyModule, SecurityModule],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
