import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { InvoiceItemResponseDto } from './invoice-item-response.dto';

export class InvoiceResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the invoice.',
    example: '85070023-4422-43f4-8390-c89d15a5687c',
  })
  id!: string;

  @ApiProperty({
    description: 'Invoice code.',
    example: 'WI3234',
  })
  invoiceCode!: string;

  @ApiProperty({
    description: 'Invoice issue date.',
    example: '2026-07-03T10:00:00.000Z',
  })
  invoiceDate!: Date;

  @ApiProperty({
    description: 'Identifier of the selected payment term',
    example: 3,
  })
  paymentTerm!: number;

  @ApiProperty({
    description: 'Invoice due date.',
    example: '2026-07-10T10:00:00.000Z',
  })
  dueDate!: Date;

  @ApiProperty({
    description: 'Date when the invoice was paid. Null if unpaid.',
    example: null,
    nullable: true,
  })
  paidAt!: Date | null;

  @ApiProperty({
    description: 'Description of the project or service.',
    example: 'Development of an invoice management system.',
    nullable: true,
  })
  projectDescription!: string | null;

  @ApiProperty({
    description: 'Current invoice status.',
    enum: InvoiceStatus,
    example: InvoiceStatus.DRAFT,
  })
  status!: InvoiceStatus;

  @ApiProperty({
    description: 'Sender name.',
    example: 'William Italia',
    nullable: true,
  })
  billFromName!: string | null;

  @ApiProperty({
    description: 'Sender email address.',
    example: 'william@example.com',
    nullable: true,
  })
  billFromEmail!: string | null;

  @ApiProperty({
    description: 'Sender street address.',
    example: '123 Main Street',
    nullable: true,
  })
  billFromStreet!: string | null;

  @ApiProperty({
    description: 'Sender city.',
    example: 'São Paulo',
    nullable: true,
  })
  billFromCity!: string | null;

  @ApiProperty({
    description: 'Sender postal code.',
    example: '11730-000',
    nullable: true,
  })
  billFromCode!: string | null;

  @ApiProperty({
    description: 'Sender country.',
    example: 'Brazil',
    nullable: true,
  })
  billFromCountry!: string | null;

  @ApiProperty({
    description: 'Recipient name.',
    example: 'Suzuki Corporation',
    nullable: true,
  })
  billToName!: string | null;

  @ApiProperty({
    description: 'Recipient email address.',
    example: 'contact@suzuki.jp',
    nullable: true,
  })
  billToEmail!: string | null;

  @ApiProperty({
    description: 'Recipient street address.',
    example: '456 Sakura Street',
    nullable: true,
  })
  billToStreet!: string | null;

  @ApiProperty({
    description: 'Recipient city.',
    example: 'Osaka',
    nullable: true,
  })
  billToCity!: string | null;

  @ApiProperty({
    description: 'Recipient postal code.',
    example: '530-0001',
    nullable: true,
  })
  billToCode!: string | null;

  @ApiProperty({
    description: 'Recipient country.',
    example: 'Japan',
    nullable: true,
  })
  billToCountry!: string | null;

  @ApiProperty({
    description: 'Invoice total amount.',
    example: 3500.5,
  })
  total!: number;

  @ApiProperty({
    description: 'List of invoice items.',
    type: () => [InvoiceItemResponseDto],
  })
  items!: InvoiceItemResponseDto[];
}
