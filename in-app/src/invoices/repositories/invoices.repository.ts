import { InvoiceEntity } from '../entities/invoice.entity';
import { CreateInvoiceData } from '../types/create-invoice.data';
import { UpdateInvoiceData } from '../types/update-invoice.data';

export abstract class InvoicesRepositoryContract {
  abstract findAll(userId: string): Promise<InvoiceEntity[]>;
  abstract findById(
    userId: string,
    invoiceId: string,
  ): Promise<InvoiceEntity | null>;

  abstract create(data: CreateInvoiceData): Promise<InvoiceEntity>;
  abstract update(data: UpdateInvoiceData): Promise<InvoiceEntity | null>;

  abstract existsCode(code: string): Promise<boolean>;
  abstract getDays(id: number): Promise<number | null>;
}
