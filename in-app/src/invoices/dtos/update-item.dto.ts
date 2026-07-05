import { IsInt, IsOptional } from 'class-validator';
import { CreateItemDto } from './create-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemDto extends CreateItemDto {
  @ApiProperty({
    description:
      'Item identifier. Required to updated an existing item. omit this fied to create a new item.',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  id?: number;
}
