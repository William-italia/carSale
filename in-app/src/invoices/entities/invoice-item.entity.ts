import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

@Entity('invoice_items')
export class InvoiceItemEntity {
  @PrimaryGeneratedColumn('identity')
  id!: number;

  @Column()
  name!: string;

  @Column()
  quantity!: number;

  @Column({ name: 'unit_price' })
  unitPrice!: number;

  // Invoice relation
  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.items)
  @JoinColumn({ name: 'invoice_id' })
  invoice!: InvoiceEntity[];
}
