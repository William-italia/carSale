import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { BcryptHash } from './bcrypt-hash.service';

@Module({
    providers: [
        {
            provide: HashService,
            useClass: BcryptHash
        }
    ],
    exports: [
        HashService,
    ]
})
export class CryptographyModule {}
