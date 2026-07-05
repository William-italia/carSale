import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class CreatePendingDto {
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
    minimum: 1,
    maximum: 4,
  })
  @IsInt()
  paymentTermId!: number;

  @ApiProperty({
    description: 'List of invoice items.',
    type: () => [CreateItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
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
  billFromName!: string;

  @ApiProperty({
    description: 'Sender email address.',
    example: 'william@example.com',
  })
  @IsString()
  billFromEmail!: string;

  @ApiProperty({
    description: 'Sender street address.',
    example: '123 Main Street',
  })
  @IsString()
  billFromStreet!: string;

  @ApiProperty({ description: 'Sender city.', example: 'São Paulo' })
  @IsString()
  billFromCity!: string;

  @ApiProperty({ description: 'Sender postal code.', example: '11730-000' })
  @IsString()
  billFromCode!: string;

  @ApiProperty({ description: 'Sender country.', example: 'Brazil' })
  @IsString()
  billFromCountry!: string;

  @ApiProperty({
    description: 'Recipient name.',
    example: 'Suzuki Corporation',
  })
  @IsString()
  billToName!: string;

  @ApiProperty({
    description: 'Recipient email address.',
    example: 'contact@suzuki.jp',
  })
  @IsString()
  billToEmail!: string;

  @ApiProperty({
    description: 'Recipient street address.',
    example: '456 Sakura Street',
  })
  @IsString()
  billToStreet!: string;

  @ApiProperty({ description: 'Recipient city.', example: 'Osaka' })
  @IsString()
  billToCity!: string;

  @ApiProperty({ description: 'Recipient postal code.', example: '530-0001' })
  @IsString()
  billToCode!: string;

  @ApiProperty({ description: 'Recipient country.', example: 'Japan' })
  @IsString()
  billToCountry!: string;
}
