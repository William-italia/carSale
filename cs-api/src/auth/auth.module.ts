import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { CryptographyModule } from '@src/cryptography/cryptography.module';

@Module({
  imports: [  
    CryptographyModule,
    UsersModule
  ],
  providers: [
    AuthService,
  ],
  controllers: [AuthController]
})
export class AuthModule {}
