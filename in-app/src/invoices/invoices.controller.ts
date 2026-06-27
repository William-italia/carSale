import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Invoices')
@Controller('invoice')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  // getInvoice
  @Get(':id')
  getInvoice(@Param() id: string) {
    return this.invoiceService.findInvoice(id);
  }

  // create invoice
  @Post()
  registerInvoice() {}

  // update Invoice
  @Patch()
  updateInvoice() {}

  // deleteInvoice
  @Delete()
  removeInvoice() {}
}

// make entities in (invoice.entity.ts) and contract of repository in (invoices.repository.ts), apply contract in (typeorm-invoices.repository.ts)

// refactor endpoints module users and auth
/*
Auth
POST   /login
POST   /register
POST   /refresh
POST   /logout

User
GET    /me
PATCH  /me

Invoices
GET    /invoices
GET    /invoices/:id
POST   /invoices
PATCH  /invoices/:id
DELETE /invoices/:id

Payment Terms
GET    /payment-terms
*/
