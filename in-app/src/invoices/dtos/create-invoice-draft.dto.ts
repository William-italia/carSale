import { IsArray, IsDate, IsEmail, IsInt, IsOptional, IsString, Max, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateItemDto } from './create-item.dto';

export class CreateInvoiceDraftDto {
   
    @IsDate()
    @Type(() => Date)
    invoiceDate!: Date;

    @IsInt()
    @Max(4)
    @Min(1)
    paymentTermId!: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateItemDto)
    items!: CreateItemDto[];

    @IsString()
    @IsOptional()
    projectDescription?: string;
  
    @IsOptional()
    @IsString()
    billFromName?: string;
  
    @IsOptional()
    @IsEmail()
    billFromEmail?: string;
  
    @IsOptional()
    @IsString()
    billFromStreet?: string;
  
    @IsOptional()
    @IsString()
    billFromCity?: string;
  
    @IsOptional()
    @IsString()
    billFromCode?: string;
  
    @IsOptional()
    @IsString()
    billFromCountry?: string;
  
    @IsOptional()
    @IsString()
    @MinLength(4)
    billToName?: string;
  
    @IsOptional()
    @IsEmail()
    billToEmail?: string;
  
    @IsOptional()
    @IsString()
    billToStreet?: string;
  
    @IsOptional()
    @IsString()
    billToCity?: string;
  
    @IsOptional()
    @IsString()
    billToCode?: string;
  
    @IsOptional()
    @IsString()
    billToCountry?: string;
    
}
