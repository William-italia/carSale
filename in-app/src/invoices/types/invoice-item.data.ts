import { InvoiceItemEntity } from "../entities/invoice-item.entity";

export type createItemData = Omit<InvoiceItemEntity, 'id' | 'invoice'>