import { UpdateItemDto } from '../dtos/update-item.dto';
import { CreateItemData } from './create-item.data';
import { UpdateItemData } from './update-item.data';

export type InvoiceItemOperations = {
  remove: number[];
  update: UpdateItemData[];
  create: CreateItemData[];
};
