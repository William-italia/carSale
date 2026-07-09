import { Repository } from 'typeorm';
import { DataSource } from 'typeorm/browser';
import { InvoicesRepositoryContract } from './invoices.repository';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceItemEntity } from '../entities/invoice-item.entity';
import { PaymentTermsEntity } from '../entities/payment_terms.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateInvoiceData } from '../types/create-invoice.data';
import { UpdateInvoiceData } from '../types/update-invoice.data';

@Injectable()
export class TypeOrmInvoicesRepository extends InvoicesRepositoryContract {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

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

  // async create(data: CreateInvoiceData): Promise<InvoiceEntity> {
  //   const invoice = this.invoiceOrmRepository.create(data);
  //   return this.invoiceOrmRepository.save(invoice);
  // }

  // createManyItems(data: CreateItemData[]): Promise<InvoiceItemEntity[]> {
  //   const items = this.invoiceItemsOrmRepository.create(data);
  //   return this.invoiceItemsOrmRepository.save(items);
  // }

  async create(data: CreateInvoiceData): Promise<InvoiceEntity> {
    return this.dataSource.transaction(async (manager) => {
      const result = await manager.insert(InvoiceEntity, data.data);

      const invoiceId = result.identifiers[0].id;

      if (data.items.length) {
        const items = data.items.map((item) => ({
          ...item,
          invoiceId,
        }));

        await manager.insert(InvoiceItemEntity, items);
      }

      return manager.findOneOrFail(InvoiceEntity, {
        where: { id: invoiceId },
      });
    });
  }

  async update(data: UpdateInvoiceData): Promise<InvoiceEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      await manager.update(InvoiceEntity, data.invoiceId, data.data);

      if (data.items.remove.length) {
        await manager.delete(InvoiceItemEntity, data.items.remove);
      }

      if (data.items.create.length) {
        await manager.insert(InvoiceItemEntity, data.items.create);
      }

      if (data.items.update.length) {
        for (const item of data.items.update) {
          await manager.update(InvoiceItemEntity, item.id, {
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          });
        }
      }

      return manager.findOne(InvoiceEntity, {
        where: { id: data.invoiceId },
        relations: {
          items: true,
        },
      });
    });
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
