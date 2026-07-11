import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { ICryptoService } from './crypto.service';

@Injectable()
export class CryptoHash extends ICryptoService {
  
  hash(value: string): string {
     return createHash('sha256')
      .update(value)
      .digest('hex');
  }

  compare(value: string, hash: string): boolean {
    const valueHashed = createHash('sha256').update(value).digest('hex');
    if(valueHashed === hash) return true;
    return false;
  }

}
