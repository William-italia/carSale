import { InvoiceItemEntity } from '../entities/invoice-item.entity';

export type UpdateItemData = Omit<InvoiceItemEntity, 'invoiceId' | 'invoice'>;
