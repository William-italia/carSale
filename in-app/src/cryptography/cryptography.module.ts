import { Module } from '@nestjs/common';
import { IBcryptService } from './bcrypt.service';
import { bcryptHash } from './bcrypt-hash.service';
import { ICryptoService } from './crypto.service';
import { CryptoHash } from './crypto-hash.service';

@Module({
  providers: [
    {
      provide: IBcryptService,
      useClass: bcryptHash,
    },
    {
      provide: ICryptoService,
      useClass: CryptoHash,
    },
  ],
  exports: [IBcryptService, ICryptoService],
})
export class CryptographyModule {}
