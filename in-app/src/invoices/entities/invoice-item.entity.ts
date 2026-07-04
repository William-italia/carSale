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

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'decimal', name: 'unit_price' })
  unitPrice!: number;

  @Column({ name: 'invoice_id' })
  invoiceId!: string;

  // Invoice relation
  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice!: InvoiceEntity;
}
