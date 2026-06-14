import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { CryptographyModule } from './cryptography/cryptography.module';
import { HashService } from './cryptography/hash.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db.sqlite',
      entities: [UserEntity],
      synchronize: true,
    }),
    UsersModule,
    CryptographyModule,
  ],
})
export class AppModule {}
