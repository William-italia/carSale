import { CreateItemData } from './create-item.data';
import { InvoiceData } from './invoice.data';

export type CreateInvoiceData = {
  data: InvoiceData;
  items: CreateItemData[];
};
