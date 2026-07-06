import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { InvoiceEntity } from './entities/invoice.entity';
import { AuthGuard } from '@src/auth/auth.guard';
import { CurrentUser } from '@src/auth/params/token-payload.param';
import { TokenPayloadDto } from '@src/auth/dtos/token-payload.dto';
import { InvoiceResponseDto } from './dtosRes/invoice-response.dto';
import { InvoiceSummaryResponseDto } from './dtosRes/invoice-summary-response.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';

@UseGuards(AuthGuard)
@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Get()
  async findAll(
    @CurrentUser() currentUser: TokenPayloadDto,
  ): Promise<InvoiceEntity[]> {
    return this.invoiceService.findAll(currentUser);
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the invoice.',
    example: '85070023-4422-43f4-8390-c89d15a5687c',
  })
  @ApiOkResponse({ type: InvoiceResponseDto })
  @Get(':id')
  async findOne(
    @Param() param: { id: string },
    @CurrentUser() currentUser: TokenPayloadDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.findOne(currentUser, param.id);
  }

  // create invoice Draft
  @ApiOkResponse({ type: InvoiceSummaryResponseDto })
  @Post('draft')
  async createDraft(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Body() body: CreateInvoiceDto,
  ): Promise<InvoiceSummaryResponseDto> {
    // console.log(body);
    return this.invoiceService.create(currentUser, body, InvoiceStatus.DRAFT);
  }

  // create invoice pending
  @Post('pending')
  @ApiOkResponse({ type: InvoiceSummaryResponseDto })
  async createPending(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Body() body: CreateInvoiceDto,
  ): Promise<InvoiceSummaryResponseDto> {
    return this.invoiceService.create(currentUser, body, InvoiceStatus.PENDING);
  }

  @Patch(':id')
  async update(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Param('id') id: string,
    @Body() body: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.update(currentUser, id, body);
  }
}
