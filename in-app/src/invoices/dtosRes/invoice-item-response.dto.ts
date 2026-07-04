import { ApiProperty } from '@nestjs/swagger';

export class InvoiceItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the invoice item.',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Name of the product or service.',
    example: 'Website Development',
  })
  name!: string;

  @ApiProperty({
    description: 'Quantity of the product or service.',
    example: 2,
  })
  quantity!: number;

  @ApiProperty({
    description: 'Unit price of the product or service.',
    example: 1500,
  })
  unitPrice!: number;
}
