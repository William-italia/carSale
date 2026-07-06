import { InvoiceData } from './invoice.data';
import { InvoiceItemOperations } from './items-organize.data';

export type CreateInvoiceOperation = {
  data: InvoiceData;
  items: InvoiceItemOperations;
  invoiceId: string;
};
