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

  @Column({ name: 'invoice_number', unique: true, nullable: true })
  invoiceNumber!: string;

  @Column({ name: 'invoice_date', nullable: true })
  invoiceDate!: Date; // invoice creation date

  @Column({ name: 'due_date', nullable: true })
  dueDate!: Date;

  @Column({ name: 'paid_at', nullable: true })
  paidAt!: Date;

  @Column({ name: 'project_description', nullable: true })
  projectDescription!: string;

  @Column({
    type: 'simple-enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status!: InvoiceStatus; // [draft, pending, paid, overdue, cancelled]

  @Column({ name: 'bill_from_name' })
  billFromName!: string;

  @Column({ name: 'bill_from_street', nullable: true })
  billFromStreet!: string;

  @Column({ name: 'bill_from_city', nullable: true })
  billFromCity!: string;

  @Column({ name: 'bill_from_code', nullable: true })
  billFromCode!: string;

  @Column({ name: 'bill_from_country', nullable: true })
  billFromCountry!: string;

  @Column({ name: 'bill_to_name' })
  billToName!: string;

  @Column({ name: 'bill_to_street', nullable: true })
  billToStreet!: string;

  @Column({ name: 'bill_to_city', nullable: true })
  billToCity!: string;

  @Column({ name: 'bill_to_code', nullable: true })
  billToCode!: string;

  @Column({ name: 'bill_to_country', nullable: true })
  billToCountry!: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  subtotal!: string;

  @Column({ nullable: true })
  total!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Payment relation
  @ManyToOne(() => PaymentTermsEntity, (term) => term.invoices)
  @JoinColumn({ name: 'payment_terms_id' })
  paymentTerm!: PaymentTermsEntity;

  // User relation
  @ManyToOne(() => UserEntity, (user) => user.invoices)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  // Items Relation
  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice)
  items!: InvoiceItemEntity[];
}
