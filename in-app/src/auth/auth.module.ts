import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { CryptographyModule } from '@src/cryptography/cryptography.module';
import { BcryptHash } from '@src/cryptography/bcrypt-hash.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [  
    UsersModule,
    CryptographyModule,
    JwtModule.register({
      global: true,
      // todo: switch to .env variable
      secret: 'minhasenhasecreta',
      signOptions: {
        expiresIn: 60 * 15,
      }
    })
  ],
  providers: [
    AuthService,
    BcryptHash
  ],
  controllers: [AuthController]
})
export class AuthModule {}
