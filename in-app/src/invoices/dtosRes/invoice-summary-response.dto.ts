import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '../enums/invoice-status.enum';

export class InvoiceSummaryResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the invoice.',
    example: '85070023-4422-43f4-8390-c89d15a5687c',
  })
  id!: string;

  @ApiProperty({ description: 'Invoice code.', example: 'WI3234' })
  invoiceCode!: string;
  @ApiProperty({
    description: 'Invoice due date.',
    example: '2026-07-10T10:00:00.000Z',
  })
  dueDate!: Date;

  @ApiProperty({
    description: 'Recipient name.',
    example: 'Suzuki Corporation',
    nullable: true,
  })
  billToName!: string | null;

  @ApiProperty({ description: 'Total invoice amount.', example: 3500.5 })
  total!: number;

  @ApiProperty({
    description: 'Current invoice status.',
    enum: InvoiceStatus,
    example: 'draft || pending',
  })
  status!: InvoiceStatus;
}
