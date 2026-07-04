import { InvoiceItemEntity } from '../entities/invoice-item.entity';
import { InvoiceEntity } from '../entities/invoice.entity';
import { CreateInvoiceData } from '../types/create-invoice.data';
import { CreateItemData } from '../types/create-item.data';

export abstract class InvoicesRepositoryContract {
  abstract findAll(userId: string): Promise<InvoiceEntity[]>;
  abstract findById(
    userId: string,
    invoiceId: string,
  ): Promise<InvoiceEntity | null>;

  abstract create(data: CreateInvoiceData): Promise<InvoiceEntity>;

  abstract createManyItems(
    data: CreateItemData[],
  ): Promise<InvoiceItemEntity[]>;

  abstract existsCode(code: string): Promise<boolean>;
  abstract getDays(id: number): Promise<number | null>;
}
