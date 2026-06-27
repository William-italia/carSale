import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoicesService {
  constructor() {
    // private readonly invoiceRepository: InvoicesRepository,
    // private readonly invoiceItem: ...
  }

  // get all invoices
  async findInvoices() {}

  // find a specific invoice by id
  async findInvoice(id) {}

  // record a new invoice
  async registerInvoice(dto) {}

  // updated a specific invoice by id
  async updateInvoice(id, dto) {}

  // remove the invoice by id
  async removeInvoice(id) {}
}
