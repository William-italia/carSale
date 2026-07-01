import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

@Entity('invoice_items')
export class InvoiceItemEntity {
  @PrimaryGeneratedColumn('identity')
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  name!: string | null;

  @Column({ type: 'integer', nullable: true })
  quantity!: number | null;

  @Column({ type: 'decimal', name: 'unit_price', nullable: true })
  unitPrice!: number | null;

  @Column({ name: 'invoice_id' })
  invoiceId!: string;

  // Invoice relation
  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice!: InvoiceEntity;
}
