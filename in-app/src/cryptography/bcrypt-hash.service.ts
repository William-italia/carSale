import { Injectable } from '@nestjs/common';
import { IBcryptService } from './bcrypt.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class bcryptHash extends IBcryptService {

  hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }

}
