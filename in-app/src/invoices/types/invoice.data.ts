import { InvoiceEntity } from "../entities/invoice.entity";

export type buildInvoiceData = Omit<InvoiceEntity, 'id' | 'createdAt' | 'updatedAt' | 'paymentTerm' | 'user' | 'items' >