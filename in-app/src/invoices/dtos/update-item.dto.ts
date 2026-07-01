import { IsInt, IsOptional, IsString } from "class-validator";
import { CreateItemDto } from "./create-item.dto";

export class UpdateItemDto extends CreateItemDto {

    @IsInt()
    @IsOptional()
    id?: number;
    
    @IsString()
    @IsOptional()
    invoiceId?: string;
}