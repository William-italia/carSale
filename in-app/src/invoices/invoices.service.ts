import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvoicesRepositoryContract } from './repositories/invoices.repository';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceMapper } from './mappers/invoice-mapper';
import { TokenPayloadDto } from '@src/auth/dtos/token-payload.dto';
import { InvoiceResponseDto } from './dtosRes/invoice-response.dto';
import { CreateDraftDto } from './dtos/create-draft.dto';
import { InvoiceSummaryResponseDto } from './dtosRes/invoice-summary-response.dto';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { CreateInvoiceData } from './types/create-invoice.data';
import { CreateItemDto } from './dtos/create-item.dto';
import { CreatePendingDto } from './dtos/create-pending.dto';
import { CreateItemData } from './types/create-item.data';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { CreateInvoiceOperation } from './types/create-operation.data';
import { InvoiceItemOperations } from './types/items-organize.data';
import { UpdateItemData } from './types/update-item.data';

@Injectable()
export class InvoicesService {
  constructor(private readonly invoiceRepository: InvoicesRepositoryContract) {}

  async findAll(user: TokenPayloadDto): Promise<InvoiceEntity[]> {
    return this.invoiceRepository.findAll(user.sub);
  }

  async findOne(
    user: TokenPayloadDto,
    invoiceId: string,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findById(user.sub, invoiceId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found!');
    }

    return InvoiceMapper.toResponse(invoice);
  }

  async createDraft(
    user: TokenPayloadDto,
    dto: CreateDraftDto,
  ): Promise<InvoiceSummaryResponseDto> {
    const data: CreateInvoiceData = await this.buildInvoiceData(
      user.sub,
      InvoiceStatus.DRAFT,
      dto,
    );

    const newInvoice = await this.invoiceRepository.create(data);

    if (dto.items.length > 0) {
      await this.invoiceRepository.createManyItems(
        this.buildItems(dto.items, newInvoice.id),
      );
    }

    return InvoiceMapper.toSummaryResponseDto(newInvoice);
  }

  // trocar create para transaction tbm, e refatorar os metodos create

  async createPending(
    user: TokenPayloadDto,
    dto: CreatePendingDto,
  ): Promise<InvoiceSummaryResponseDto> {

    const data: CreateInvoiceData = await this.buildInvoiceData(
      user.sub,
      InvoiceStatus.PENDING,
      dto,
    );

    this.validatePending(data, dto.items);

    const newInvoice = await this.invoiceRepository.create(data);
    await this.invoiceRepository.createManyItems(
      this.buildItems(dto.items, newInvoice.id),
    );

    return InvoiceMapper.toSummaryResponseDto(newInvoice);
  }

  async update(
    user: TokenPayloadDto,
    invoiceId: string,
    dto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findById(user.sub, invoiceId);

    if (!invoice) throw new NotFoundException('Invoice not found!');

    switch (invoice.status) {
      case InvoiceStatus.DRAFT:
      case InvoiceStatus.PENDING:
        return this.executeUpdateInvoice(invoice, dto);


      default:
        throw new BadRequestException('Invoice cannot be updated.');
    }
  }

   private async executeUpdateInvoice(invoice: InvoiceEntity, dto: UpdateInvoiceDto): Promise<InvoiceResponseDto> {

    const data = await this.buildInvoiceData(
      invoice.userId,
      invoice.status,
      dto,
      invoice,
    );
    const { items } = dto;

      
    if(invoice.status === 'pending') this.validatePending(data, items);
    
    const itemsOrganized = this.organizeItems(items, invoice);    

    const op: CreateInvoiceOperation = {
      data: data,
      items: itemsOrganized,
      invoiceId: invoice.id,
    }
  
    const invoiceUpdated = await this.invoiceRepository.update(op);

    if(!invoiceUpdated) throw new NotFoundException('Invoice not found!');

    return InvoiceMapper.toResponse(invoiceUpdated);
  }


  private validatePending(
    data: CreateInvoiceData,
    items: CreateItemDto[],
  ) {
    const requiredFields = [
      'billFromName',
      'billFromEmail',
      'billFromStreet',
      'billFromCity',
      'billFromCode',
      'billFromCountry',
      'billToName',
      'billToEmail',
      'billToStreet',
      'billToCity',
      'billToCode',
      'billToCountry',
    ] as const;

    const missingFields = requiredFields.filter((field) => data[field] == null);

    if (missingFields.length > 0) {
      throw new BadRequestException({
        message: 'Missing fields!',
        missingFields,
      });
    }

    if (items.length === 0) {
      throw new BadRequestException(
        'Pending invoices require at least one recorded item.',
      );
    }
  }

  private organizeItems(items: UpdateItemDto[], invoice: InvoiceEntity): InvoiceItemOperations {
    const { items: invoiceItems } = invoice;

    const dbIdItems = invoiceItems.map((i) => i.id);
    const currentIdItems = items.filter((i) => i.id).map((i) => i.id);
    const newItems = items.filter((i) => !i.id);

    const removeItemsID = dbIdItems.filter(
      (id) => !currentIdItems.includes(id),
    );
    const updateItems = items.filter((item): item is UpdateItemData => item.id !== undefined);
    const addItems = this.buildItems(newItems, invoice.id);

    this.validateUpdateItemsIds(dbIdItems, updateItems);

    return {
      remove: removeItemsID,
      update: updateItems,
      create: addItems,
    };
  }

  private validateUpdateItemsIds(
    InvoiceItemsIds: number[],
    updateItems: UpdateItemDto[],
  ) {
    const validIds = new Set(InvoiceItemsIds);

    for (const item of updateItems) {
      if (item.id && !validIds.has(item.id)) {
        throw new BadRequestException('Invalid item id');
      }
    }
  }

  private calculateSubtotal(items: CreateItemDto[]): number {
    return items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
  }

  private buildItems(
    items: CreateItemDto[],
    invoiceId: string,
  ): CreateItemData[] {
    const itemsWithInvoiceId = items.map((item) => ({
      ...item,
      invoiceId,
    }));

    return itemsWithInvoiceId;
  }

  private async buildInvoiceData(
    userId: string,
    status: InvoiceStatus,
    dto: CreateDraftDto | CreatePendingDto | UpdateInvoiceDto,
    invoice?: InvoiceEntity,
  ): Promise<CreateInvoiceData> {
 
    const { items, ...fields } = dto;

    const dueDate = await this.createDueDate(status, fields, invoice);
    const subtotal = this.calculateSubtotal(items);
    const normalizeFields = this.normalizeFields(fields);

    return {
      ...normalizeFields,
      invoiceCode: invoice?.invoiceCode ?? (await this.codeUnique()),
      dueDate,
      paidAt: invoice?.paidAt ?? null,
      userId,
      status,
      subtotal,
      total: subtotal,
    };

  }

  private normalizeFields<T extends Record<string, any>>(fields: T): T {
    return Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() || null : value,
      ]),
    ) as T;
  }

  private generateRandomCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const l1 = letters[Math.floor(Math.random() * letters.length)];
    const l2 = letters[Math.floor(Math.random() * letters.length)];

    const numbers = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    return `${l1}${l2}${numbers}`;
  }

  private async codeUnique(): Promise<string> {
    while (true) {
      const code = this.generateRandomCode();
      const exists = await this.invoiceRepository.existsCode(code);

      if (!exists) return code;
    }
  }

  private async calculateDueDate(
    invoiceDate: Date,
    paymentTermId: number,
  ): Promise<Date> {
    const days = Number(await this.invoiceRepository.getDays(paymentTermId));

    if (!days) throw new BadRequestException('Payment term invalid!');

    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + days);

    if (dueDate.getTime() < Date.now()) {
      throw new BadRequestException('Due date connot be in the past');
    }

    return dueDate;
  }

  private async createDueDate(
    status: InvoiceStatus,
    fields: { invoiceDate: Date; paymentTermId: number },
    invoice?: InvoiceEntity,
  ): Promise<Date> {
    
    if(!invoice) {
      return this.calculateDueDate(fields.invoiceDate, fields.paymentTermId);
    }
    
    const paymentChanged = fields.paymentTermId !== invoice?.paymentTermId;
    const invoiceDateChanged =
      fields.invoiceDate.getTime() !== invoice?.invoiceDate.getTime();

    if (invoice && status === InvoiceStatus.DRAFT && (paymentChanged || invoiceDateChanged)
    ) {
      return this.calculateDueDate(
        fields.invoiceDate,
        fields.paymentTermId,
      );
    }

    if (invoice && status === InvoiceStatus.PENDING && paymentChanged) {
      return await this.calculateDueDate(
        fields.invoiceDate,
        fields.paymentTermId,
      );
    }

    return invoice.dueDate;
  }
}
