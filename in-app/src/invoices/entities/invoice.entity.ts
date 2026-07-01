import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceItemEntity } from './invoice-item.entity';
import { UserEntity } from '@src/users/entities/user.entity';
import { PaymentTermsEntity } from './payment_terms.entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';

@Entity('invoices')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', name: 'invoice_number' })
  invoiceNumber!: string; 

  @Column({ type: 'datetime', name: 'invoice_date' })
  invoiceDate!: Date; 

  @Column({ type: 'datetime', name: 'due_date'})
  dueDate!: Date;

  @Column({ type: 'datetime', name: 'paid_at', nullable: true })
  paidAt!: Date | null;

  @Column({ type: 'varchar', name: 'project_description', nullable: true })
  projectDescription?: string;

  @Column({
    type: 'simple-enum',
    enum: InvoiceStatus,
  })
  status!: InvoiceStatus; // [draft, pending, paid, overdue, cancelled]

  @Column({ type: 'varchar', name: 'bill_from_name', nullable: true })
  billFromName?: string;

  @Column({ type: 'varchar', name: 'bill_from_email', nullable: true })
  billFromEmail?: string;

  @Column({ type: 'varchar', name: 'bill_from_street', nullable: true })
  billFromStreet?: string;

  @Column({ type: 'varchar', name: 'bill_from_city', nullable: true })
  billFromCity?: string;

  @Column({ type: 'varchar', name: 'bill_from_code', nullable: true })
  billFromCode?: string;

  @Column({ type: 'varchar', name: 'bill_from_country', nullable: true })
  billFromCountry?: string;

  @Column({ type: 'varchar', name: 'bill_to_name', nullable: true })
  billToName?: string;

  @Column({ type: 'varchar', name: 'bill_to_email', nullable: true })
  billToEmail?: string;

  @Column({ type: 'varchar', name: 'bill_to_street', nullable: true })
  billToStreet?: string;

  @Column({ type: 'varchar', name: 'bill_to_city', nullable: true })
  billToCity?: string;

  @Column({ type: 'varchar', name: 'bill_to_code', nullable: true })
  billToCode?: string;

  @Column({ type: 'varchar', name: 'bill_to_country', nullable: true })
  billToCountry?: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  subtotal!: number;

  @Column({ type: 'decimal' })
  total!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Payment relation
  @ManyToOne(() => PaymentTermsEntity, (term) => term.invoices)
  @JoinColumn({ name: 'payment_terms_id' })
  paymentTerm!: PaymentTermsEntity;

  @Column({ name: 'payment_terms_id' })
  paymentTermId!: number;

  // User relation
  @ManyToOne(() => UserEntity, (user) => user.invoices)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'user_id' })
  userId!: string;

  // Items Relation
  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice, {
    cascade: true,
  })
  items!: InvoiceItemEntity[];
}
