import { InvoiceItemEntity } from '../entities/invoice-item.entity';

export type CreateItemData = Omit<InvoiceItemEntity, 'id' | 'invoice'>;
