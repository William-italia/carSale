import { InvoiceEntity } from '../entities/invoice.entity';

export type CreateInvoiceData = Omit<
  InvoiceEntity,
  'id' | 'createdAt' | 'updatedAt' | 'paymentTerm' | 'user' | 'items'
>;
