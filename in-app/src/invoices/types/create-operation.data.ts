import { CreateInvoiceData } from './create-invoice.data';
import { InvoiceItemOperations } from './items-organize.data';

export type CreateInvoiceOperation = {
  data: CreateInvoiceData;
  items: InvoiceItemOperations;
  invoiceId: string;
};
