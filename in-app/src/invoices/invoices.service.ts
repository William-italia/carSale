import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InvoicesRepositoryContract } from './repositories/invoices.repository';
import { InvoiceEntity } from './entities/invoice.entity';
import { CreateInvoiceDraftDto } from './dtos/create-invoice-draft.dto';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { CreateItemDto } from './dtos/create-item.dto';
import { CreateInvoicePendingDto } from './dtos/create-invoice-pending.dto';
import { buildInvoiceData } from './types/invoice.data';
import { InvoiceInfosDto } from './dtos/invoice-infos.dto';
import { InvoiceMapper } from './mappers/invoice-mapper';
import { TokenPayloadDto } from '@src/auth/dtos/token-payload.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { updateInvoiceData } from './types/invoice-update.data';

@Injectable()
export class InvoicesService {
  constructor(private readonly invoiceRepository: InvoicesRepositoryContract) {}

  // get all invoices
  async findInvoices(user: TokenPayloadDto): Promise<InvoiceEntity[]> {
    return this.invoiceRepository.findAll(user.sub);
  }

  // find a specific invoice by id
  async findInvoice(user: TokenPayloadDto, invoiceId: string): Promise<unknown> {
    const invoice = await this.invoiceRepository.findById(user.sub, invoiceId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found!');
    }

    const items = await this.invoiceRepository.findItems(invoice.id);
    
    //depois fazer um mapper
    return {
      invoice: {
        ...invoice,
        items: items,
      },
    };
  }

  async submitInvoice(user: TokenPayloadDto, invoiceId: string) {
  
    const invoice = await this.invoiceRepository.findById(user.sub, invoiceId);
    
    if(!invoice) {
      throw new NotFoundException('Invoice not found!');
    }

    if(invoice.status !== 'draft') {
      throw new BadRequestException('Invoice is not a draft');
    }
    
    await this.validateInvoice(invoice)

    if(invoice.items.length === 0) {
      throw new BadRequestException('Invoice requires at least one item');
    }

    invoice.status = InvoiceStatus.PENDING;    

    const updatedInvoice = await this.invoiceRepository.save(invoice);

    return updatedInvoice;
    
  } 

  async invoiceDraft(user: TokenPayloadDto, dto: CreateInvoiceDraftDto) {

    const { items: itemsDto, ...invoiceDto } = dto;
        
    const data = await this.buildInvoiceData(
      user.sub, 
      invoiceDto, 
      InvoiceStatus.DRAFT,
      itemsDto
    );

    const invoice = await this.invoiceRepository.createInvoice(data);
    
    const items = itemsDto?.map(item => ({
      ...item, 
      invoiceId: invoice.id
    }));

    if(items) {
      await this.invoiceRepository.createManyItems(items);
    }
    
    return InvoiceMapper.toResponse(invoice);
  }

  async invoicePending(user: TokenPayloadDto, dto: CreateInvoicePendingDto) {

      const { items: itemsDto, ...invoiceDto } = dto;
          
      const data = await this.buildInvoiceData(
        user.sub, 
        invoiceDto, 
        InvoiceStatus.PENDING,
        itemsDto
      );

      if(data.dueDate < new Date()) {
        throw new BadRequestException('Invoice due date cannot in the past')
      }

      const invoice = await this.invoiceRepository.createInvoice(data);
      
      const items = itemsDto.map(item => ({
        ...item, 
        invoiceId: invoice.id
      }));

      await this.invoiceRepository.createManyItems(items);

      return InvoiceMapper.toResponse(invoice);

  }

  async updateInvoice(user: TokenPayloadDto, invoiceId: string, dto: UpdateInvoiceDto) {

    const invoice = await this.invoiceRepository.findById(user.sub, invoiceId);
    
    if(!invoice){
      throw new NotFoundException('Invoice not found!');
    }
    
    const blockedStatus = ['cancelled', 'overdue', 'paid']
    
    if(blockedStatus.includes(invoice.status)){
      throw new BadRequestException(`${invoice.status} type invoices cannot be edited!`);
    } 
    
    const { items } = invoice; 
    const {items: ItemsDto, ...fieldsDto} = dto;

    const updateData: updateInvoiceData = {
      ...fieldsDto,
      dueDate: invoice.dueDate,
      subtotal: invoice.subtotal,
      total: invoice.total,
    }

    const oldItemIds = items.map(item => item.id); // items salvos no banco
    const dtoItemIds = dto.items.filter(item => item.id != null).map(items => items.id); // pega todos os items q tem id no dto

    // items para criar
    const newItems = dto.items.filter(item => !item.id).map(item => ({...item, invoiceId: invoice.id})); 
    // items para remover
    const removeItemsIds = oldItemIds.filter(id => !dtoItemIds.includes(id)); 
    // items para atualizar
    const existingItems = dto.items.filter(item => item.id); 
  
    

    if(invoice.status === 'draft') {

      if(updateData.invoiceDate.getDate() !== invoice.invoiceDate.getDate() || updateData.paymentTermId !== invoice.paymentTermId) {
        updateData.dueDate = await this.getDueDate(updateData.paymentTermId, updateData.invoiceDate);
      }

      const ValueTotal = this.calculateTotal(ItemsDto);

      updateData.subtotal = ValueTotal;
      updateData.total = ValueTotal;

    }
    
    if(invoice.status === 'pending') {

      if(ItemsDto.length === 0) {
        throw new BadRequestException('Pending invoices require at least one recorded item.');
      }

      if(updateData.invoiceDate.getTime() !== invoice.invoiceDate.getTime()) {
        throw new BadRequestException('The date of pending invoices cannot be changed.')
      }

      if(updateData.paymentTermId !== invoice.paymentTermId) {
        updateData.dueDate = await this.getDueDate(updateData.paymentTermId, invoice.invoiceDate);
      }


      await this.validateInvoice(updateData)


      const ValueTotal = this.calculateTotal(ItemsDto);

      updateData.subtotal = ValueTotal;
      updateData.total = ValueTotal;

    }

    // cria / atualiza / apaga os items
// {
//   invoiceId,
//   updateData,
//   newItems,
//   existingItems,
//   removeItemsIds,
// }

  }

  private async validateInvoice(invoice: InvoiceEntity | updateInvoiceData) {

    const requiredFields = [
      'invoiceDate',
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

    const missingFields = requiredFields.filter(
      field => invoice[field] == null || invoice[field] == '',
    );

    if(missingFields.length > 0) {
      throw new BadRequestException({
        message: 'missing fields.',
        missingFields,
      });
    }
    
    if(invoice.dueDate < new Date()) {
      throw new BadRequestException('Invoice due data cannot be in the past.')
    }

  }

  private async buildInvoiceData(userId: string, dto: InvoiceInfosDto, status: InvoiceStatus, items): Promise<buildInvoiceData> {
      const calculatedTotal = this.calculateTotal(items);

      const data: buildInvoiceData = {
        ...dto,
        invoiceNumber: await this.generateUniqueInvoiceNumber(),
        invoiceDate: dto.invoiceDate,
        paymentTermId: dto.paymentTermId,
        paidAt: null,
        userId,
        status,
        dueDate: await this.getDueDate(dto.paymentTermId, dto.invoiceDate),
        subtotal: calculatedTotal,
        total: calculatedTotal,
    }

    return data;
  }

  private async getDueDate(termId: number, invoiceDate: Date) {

    const days = await this.invoiceRepository.findDays(termId);
    const dueDate = new Date(invoiceDate ?? new Date());
    dueDate.setDate(dueDate.getDate() + days)

    return dueDate;
  }

  private calculateTotal(items: CreateItemDto[]): number {
      if(items.length === 0) return 0;

      return items.reduce((acc, i) => {
        return acc + i.quantity * i.unitPrice;
      }, 0);
  }

  private async generateInvoiceNumber(): Promise<string> {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const l1 = letters[Math.floor(Math.random() * letters.length)];
    const l2 = letters[Math.floor(Math.random() * letters.length)];

    const numbers = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    return `${l1}${l2}${numbers}`;
  }
  private async generateUniqueInvoiceNumber(): Promise<string> {
      while(true) {
        const number = await this.generateInvoiceNumber();
        const exists = await this.invoiceRepository.findByInvoiceNumber(number);

        if(!exists) return number;
      }
  }

 

  async payInvoice() {} // pending -> paid paidAt -> date.now

  async cancelInvoice() {} // pending -> cancel

  async removeInvoice() {}

}
