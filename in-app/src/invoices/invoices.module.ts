import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { PaymentTermsEntity } from './entities/payment_terms.entity';
import { InvoicesRepositoryContract } from './repositories/invoices.repository';
import { TypeOrmInvoicesRepository } from './repositories/typeorm-invoices.repository';
import { AuthModule } from '@src/auth/auth.module';
import { SecurityModule } from '@src/security/security.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceEntity,
      InvoiceItemEntity,
      PaymentTermsEntity,
    ]),
    SecurityModule,
  ],
  providers: [
    InvoicesService,
    {
      provide: InvoicesRepositoryContract,
      useClass: TypeOrmInvoicesRepository,
    },
  ],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
