import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { InvoiceEntity } from './entities/invoice.entity';
import { AuthGuard } from '@src/auth/auth.guard';
import { CurrentUser } from '@src/auth/params/token-payload.param';
import { TokenPayloadDto } from '@src/auth/dtos/token-payload.dto';
import { CreateInvoiceDraftDto } from './dtos/create-invoice-draft.dto';
import { CreateInvoicePendingDto } from './dtos/create-invoice-pending.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';

@UseGuards(AuthGuard)
@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Get()
  async findAll(
    @CurrentUser() currentUser: TokenPayloadDto,
  ): Promise<InvoiceEntity[]> {
    return this.invoiceService.findInvoices(currentUser);
  }

  @Get(':id')
  async find(
    @Param() param: { id: string },
    @CurrentUser() currentUser: TokenPayloadDto,
  ): Promise<unknown> {
    return this.invoiceService.findInvoice(currentUser, param.id);
  }

  @Post('draft')
  createDraft(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Body() dto: CreateInvoiceDraftDto,
  ) {
    // console.log(dto); 
    return this.invoiceService.invoiceDraft(currentUser, dto);
  } 

  @Post('pending')
  create(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Body() dto: CreateInvoicePendingDto,
  ) {
    console.log(dto);
    return this.invoiceService.invoicePending(currentUser, dto)
  } // register invoice.status = pending

  // update Invoice
  @Patch(':id') // update draft and pending fields  
  update(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Param('id') invoiceId: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    console.log(invoiceId);
    return this.invoiceService.updateInvoice(currentUser, invoiceId, dto);
  }
  
    @Patch(':id/submit') // change status for pending
  submit(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Param() param: {id: string},
  ) {
    return this.invoiceService.submitInvoice(currentUser, param.id)
  }

  @Patch(':id/pay') // change the status to 'paid' and set the 'paidAt' field to 'Date.now()'
  pay() {}

  @Patch(':id/cancel') // change status for cancel
  cancel() {}

  // deleteInvoice
  @Delete(':id')
  remove() {}
}
