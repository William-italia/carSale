import { Injectable } from '@nestjs/common';
import { HashService } from './hash.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHash extends HashService {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
