import { InvoiceResponseDto } from '../dtosRes/invoice-response.dto';
import { InvoiceSummaryResponseDto } from '../dtosRes/invoice-summary-response.dto';
import { InvoiceEntity } from '../entities/invoice.entity';

export class InvoiceMapper {
  static toResponse(invoice: InvoiceEntity): InvoiceResponseDto {
    return {
      id: invoice.id,
      invoiceCode: invoice.invoiceCode,
      invoiceDate: invoice.invoiceDate,
      paymentTerm: invoice.paymentTermId,
      dueDate: invoice.dueDate,
      paidAt: invoice.paidAt,
      projectDescription: invoice.projectDescription ?? null,
      status: invoice.status,
      billFromName: invoice.billFromName ?? null,
      billFromEmail: invoice.billFromEmail ?? null,
      billFromStreet: invoice.billFromStreet ?? null,
      billFromCity: invoice.billFromCity ?? null,
      billFromCode: invoice.billFromCode ?? null,
      billFromCountry: invoice.billFromCountry ?? null,
      billToName: invoice.billToName ?? null,
      billToEmail: invoice.billToEmail ?? null,
      billToStreet: invoice.billToStreet ?? null,
      billToCity: invoice.billToCity ?? null,
      billToCode: invoice.billToCode ?? null,
      billToCountry: invoice.billToCountry ?? null,
      total: invoice.total,
      items: invoice.items,
    };
  }

  static toSummaryResponseDto(
    invoice: InvoiceEntity,
  ): InvoiceSummaryResponseDto {
    return {
      id: invoice.id,
      invoiceCode: invoice.invoiceCode,
      dueDate: invoice.dueDate,
      billToName: invoice.billToName ?? null,
      total: invoice.total,
      status: invoice.status,
    };
  }
}
