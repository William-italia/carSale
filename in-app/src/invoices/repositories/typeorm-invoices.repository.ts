import { In, Repository } from 'typeorm';
import { InvoicesRepositoryContract } from './invoices.repository';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceItemEntity } from '../entities/invoice-item.entity';
import { PaymentTermsEntity } from '../entities/payment_terms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceData } from '../types/create-invoice.data';
import { CreateItemData } from '../types/create-item.data';

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
        invoiceCode: true,
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
      },
      relations: {
        items: true,
      },
      select: {
        items: {
          id: true,
          name: true,
          quantity: true,
          unitPrice: true,
        },
      },
    });

    if (!invoice) return null;

    return invoice;
  }

  async create(data: CreateInvoiceData): Promise<InvoiceEntity> {
    const invoice = this.invoiceOrmRepository.create(data);
    return this.invoiceOrmRepository.save(invoice);
  }

  createManyItems(data: CreateItemData[]): Promise<InvoiceItemEntity[]> {
    const items = this.invoiceItemsOrmRepository.create(data);
    return this.invoiceItemsOrmRepository.save(items);
  }

  async existsCode(code: string): Promise<boolean> {
    return this.invoiceOrmRepository.exists({
      where: {
        invoiceCode: code,
      },
    });
  }
  async getDays(id: number): Promise<number | null> {
    const term = await this.paymentTermsOrmRepository.findOne({
      where: {
        id,
      },
    });

    if (!term) return null;

    return term.days;
  }
}
