import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { CryptographyModule } from './cryptography/cryptography.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { InvoicesModule } from './invoices/invoices.module';
import { InvoiceEntity } from './invoices/entities/invoice.entity';
import { InvoiceItemEntity } from './invoices/entities/invoice-item.entity';
import { PaymentTermsEntity } from './invoices/entities/payment_terms.entity';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      database: process.env.DATABASE_DATABASE,
      entities: [
        UserEntity,
        InvoiceEntity,
        InvoiceItemEntity,
        PaymentTermsEntity,
      ],
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    }),
    UsersModule,
    CryptographyModule,
    AuthModule,
    InvoicesModule,
  ],
})
export class AppModule {}
