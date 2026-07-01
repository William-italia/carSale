import { IsInt, IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsInt()
  @Min(1)
  @Max(50)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;
}
