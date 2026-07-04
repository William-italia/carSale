import { IsInt, IsOptional } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends CreateItemDto {
  @IsOptional()
  @IsInt()
  id?: number;
}
