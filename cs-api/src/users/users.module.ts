import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';
import { UserEntity } from '@users/entities/user.entity';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { TypeOrmUsersRepository } from './repositories/typeorm-users.repository';
import { CryptographyModule } from '@src/cryptography/cryptography.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CryptographyModule
  ],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: TypeOrmUsersRepository
    }
  ],
  controllers: [UsersController]
})
export class UsersModule {}
