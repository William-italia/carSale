import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { CryptographyModule } from './cryptography/cryptography.module';
import { AuthModule } from './auth/auth.module';

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
    AuthModule,
  ],
})
export class AppModule {}
