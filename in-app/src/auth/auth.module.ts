import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { CryptographyModule } from '@src/cryptography/cryptography.module';
import { BcryptHash } from '@src/cryptography/bcrypt-hash.service';

@Module({
  imports: [  
    UsersModule,
    CryptographyModule,
  ],
  providers: [
    AuthService,
    BcryptHash
  ],
  controllers: [AuthController]
})
export class AuthModule {}
