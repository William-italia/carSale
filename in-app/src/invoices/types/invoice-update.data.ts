import { CreateInvoicePendingDto } from "../dtos/create-invoice-pending.dto";

import { InvoiceEntity } from "../entities/invoice.entity";

export type updateInvoiceData = Omit<InvoiceEntity, 'id' | 'invoiceNumber' | 'paidAt' | 'status' | 'updatedAt' | 'paymentTerm' | 'user' | 'items' | 'createdAt' | 'userId'>