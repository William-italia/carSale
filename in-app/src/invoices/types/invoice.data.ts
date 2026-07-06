import { InvoiceEntity } from '../entities/invoice.entity';

export type InvoiceData = Omit<
  InvoiceEntity,
  'id' | 'createdAt' | 'updatedAt' | 'paymentTerm' | 'user' | 'items'
>;
