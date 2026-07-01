import { Repository } from 'typeorm';
import { InvoicesRepositoryContract } from './invoices.repository';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceItemEntity } from '../entities/invoice-item.entity';
import { PaymentTermsEntity } from '../entities/payment_terms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { buildInvoiceData } from '../types/invoice.data';
import { createItemData } from '../types/invoice-item.data';

@Injectable()
export class TypeOrmInvoicesRepository extends InvoicesRepositoryContract {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceOrmRepository: Repository<InvoiceEntity>,

    @InjectRepository(InvoiceItemEntity)
    private readonly invoiceItemsOrmRepository: Repository<InvoiceItemEntity>,

    @InjectRepository(PaymentTermsEntity)
    private readonly paymentTermsOrmRepository: Repository<PaymentTermsEntity>,
  ) {
    super();
  }

  async findAll(userId: string): Promise<InvoiceEntity[]> {
    return this.invoiceOrmRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        invoiceNumber: true,
        dueDate: true,
        billToName: true,
        total: true,
        status: true,
      },
    });
  }

  async findById(
    userId: string,
    invoiceId: string,
  ): Promise<InvoiceEntity | null> {
    const invoice = await this.invoiceOrmRepository.findOne({
      where: {
        id: invoiceId,
        user: {
          id: userId,
        },
      }
    });

    if(!invoice) return null;

    const items = await this.findItems(invoice.id);

    return {
      ...invoice,
      items,
    }
      
  }

  async save(invoice: InvoiceEntity): Promise<InvoiceEntity> {
    return this.invoiceOrmRepository.save(invoice);
  }
  

  async findByInvoiceNumber(
    invoiceNumber: string,
  ): Promise<InvoiceEntity | null> {
    return this.invoiceOrmRepository.findOne({
      where: {
        invoiceNumber,
      },
    });
  }


  async createInvoice(data: buildInvoiceData): Promise<InvoiceEntity> {
    const invoice = this.invoiceOrmRepository.create(data);
    return this.invoiceOrmRepository.save(invoice);
  }

  async createManyItems(data: createItemData[]): Promise<InvoiceItemEntity[]> {
    const items = this.invoiceItemsOrmRepository.create(data);
    return this.invoiceItemsOrmRepository.save(items);
  }


  async findItems(invoiceId: string) {
    return this.invoiceItemsOrmRepository.find({
      where: {
        invoice: {
          id: invoiceId,
        },
      },
    });
  }

  async findTerms(): Promise<PaymentTermsEntity[]> {
      const terms = await this.paymentTermsOrmRepository.find({
        select: {
          id: true,
          name: true, 
        }
      });
      
      return terms;
  }

  async findDays(termId: number): Promise<number> {
    const term = await this.paymentTermsOrmRepository.findOne({
      where: {
        id: termId,
      },
    });

    if(!term) {
      throw new NotFoundException('Payment term not found!');
    }

    return term.days;
  }
}
