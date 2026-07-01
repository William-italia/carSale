import { ValidateNested } from "class-validator";
import { CreateInvoiceDraftDto } from "./create-invoice-draft.dto";
import { UpdateItemDto } from "./update-item.dto";
import { Type } from "class-transformer";

export class UpdateInvoiceDto extends CreateInvoiceDraftDto {
    @ValidateNested({each: true})
    @Type(() => UpdateItemDto)
    declare items: UpdateItemDto[];
};