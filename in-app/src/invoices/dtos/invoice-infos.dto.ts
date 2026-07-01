import { CreateInvoiceDraftDto } from "./create-invoice-draft.dto";

export type InvoiceInfosDto = Omit<CreateInvoiceDraftDto, 'items'>