import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateItemDto } from './create-item.dto';
import { Type } from 'class-transformer';

export class CreateInvoicePendingDto {

  @IsDate()
  @Type(() => Date)
  invoiceDate!: Date;

  @IsInt()
  @Max(4)
  @Min(1)
  paymentTermId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items!: CreateItemDto[];

  @IsOptional()
  @IsString()
  projectDescription?: string;

  @IsString()
  @MinLength(4)
  billFromName!: string;

  @IsEmail()
  billFromEmail!: string;

  @IsString()
  @MinLength(4)
  billFromStreet!: string;

  @IsString()
  @MinLength(4)
  billFromCity!: string;

  @IsString()
  @MinLength(4)
  billFromCode!: string;

  @IsString()
  @MinLength(4)
  billFromCountry!: string;

  @IsString()
  @MinLength(4)
  billToName!: string;

  @IsEmail()
  @MinLength(4)
  billToEmail!: string;

  @IsString()
  @MinLength(4)
  billToStreet!: string;

  @IsString()
  @MinLength(4)
  billToCity!: string;

  @IsString()
  @MinLength(4)
  billToCode!: string;

  @IsString()
  @MinLength(4)
  billToCountry!: string;
  
}


