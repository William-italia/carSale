import { InvoiceItemEntity } from '../entities/invoice-item.entity';
import { InvoiceEntity } from '../entities/invoice.entity';
import { PaymentTermsEntity } from '../entities/payment_terms.entity';
import { createItemData } from '../types/invoice-item.data';
import { buildInvoiceData } from '../types/invoice.data';

export abstract class InvoicesRepositoryContract {
  abstract findAll(userId: string): Promise<InvoiceEntity[]>;
  abstract findById(userId: string, invoiceId: string): Promise<InvoiceEntity | null>;
  abstract findByInvoiceNumber(invoiceNumber: string): Promise<InvoiceEntity | null>;
  
  abstract createInvoice(data: buildInvoiceData): Promise<InvoiceEntity>;
  abstract createManyItems(data: createItemData[]): Promise<InvoiceItemEntity[]>
  
  abstract save(invoice: InvoiceEntity): Promise<InvoiceEntity>;
  




  abstract findItems(invoiceId: string): Promise<unknown>;
  abstract findTerms(): Promise<PaymentTermsEntity[]>;
  abstract findDays(termId: number): Promise<number>;
}
