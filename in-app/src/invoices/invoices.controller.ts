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

