import { InvoiceEntity } from "../entities/invoice.entity";

export class InvoiceMapper {

    static toResponse(invoice: InvoiceEntity) {
        return {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            dueDate: invoice.dueDate,
            billToName: invoice.billToName,
            total: invoice.total,
            status: invoice.status
        }
    }
}