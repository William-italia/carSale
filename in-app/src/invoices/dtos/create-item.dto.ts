import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'Name of the product or service.',
    example: 'Website Development',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name!: string;

  @ApiProperty({
    description: 'Quantity of the item.',
    example: 2,
    minimum: 1,
    maximum: 50,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  quantity!: number;

  @ApiProperty({
    description: 'Unit price of the item.',
    example: 1500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}
