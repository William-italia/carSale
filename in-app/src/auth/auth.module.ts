import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { CryptographyModule } from '@src/cryptography/cryptography.module';
import { BcryptHash } from '@src/cryptography/bcrypt-hash.service';
import { SecurityModule } from '@src/security/security.module';

@Module({
  imports: [UsersModule, CryptographyModule, SecurityModule],
  providers: [AuthService, BcryptHash],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
