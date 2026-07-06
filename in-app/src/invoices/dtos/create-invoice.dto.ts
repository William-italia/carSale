import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateItemDto } from './create-item.dto';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Invoice issue date.',
    example: '2026-07-03T10:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  invoiceDate!: Date;

  @ApiProperty({
    description: 'Payment terms identifier.',
    example: 2,
  })
  @IsInt()
  paymentTermId!: number;

  @ApiProperty({
    description: 'List of invoice items.',
    type: () => [CreateItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items!: CreateItemDto[];

  @ApiPropertyOptional({
    description: 'Project or service description.',
    example: 'Development of an invoice management system.',
  })
  @IsString()
  @IsOptional()
  projectDescription?: string;

  @ApiProperty({ description: 'Sender name.', example: 'William Italia' })
  @IsString()
  @IsOptional()
  billFromName?: string;

  @ApiProperty({
    description: 'Sender email address.',
    example: 'william@example.com',
  })
  @IsString()
  @IsOptional()
  billFromEmail?: string;

  @ApiProperty({
    description: 'Sender street address.',
    example: '123 Main Street',
  })
  @IsString()
  @IsOptional()
  billFromStreet?: string;

  @ApiProperty({ description: 'Sender city.', example: 'São Paulo' })
  @IsString()
  @IsOptional()
  billFromCity?: string;

  @ApiProperty({ description: 'Sender postal code.', example: '11730-000' })
  @IsString()
  @IsOptional()
  billFromCode?: string;

  @ApiProperty({ description: 'Sender country.', example: 'Brazil' })
  @IsString()
  @IsOptional()
  billFromCountry?: string;

  @ApiProperty({
    description: 'Recipient name.',
    example: 'Suzuki Corporation',
  })
  @IsString()
  @IsOptional()
  billToName?: string;

  @ApiProperty({
    description: 'Recipient email address.',
    example: 'contact@suzuki.jp',
  })
  @IsString()
  @IsOptional()
  billToEmail?: string;

  @ApiProperty({
    description: 'Recipient street address.',
    example: '456 Sakura Street',
  })
  @IsString()
  @IsOptional()
  billToStreet?: string;

  @ApiProperty({ description: 'Recipient city.', example: 'Osaka' })
  @IsString()
  @IsOptional()
  billToCity?: string;

  @ApiProperty({ description: 'Recipient postal code.', example: '530-0001' })
  @IsString()
  @IsOptional()
  billToCode?: string;

  @ApiProperty({ description: 'Recipient country.', example: 'Japan' })
  @IsString()
  @IsOptional()
  billToCountry?: string;
}
