import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { CryptographyModule } from './cryptography/cryptography.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      database: process.env.DATABASE_DATABASE,
      entities: [UserEntity],
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    }),
    UsersModule,
    CryptographyModule,
    AuthModule,
  ],
})
export class AppModule {}
