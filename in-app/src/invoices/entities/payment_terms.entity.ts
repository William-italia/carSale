import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

@Entity('payment_terms')
export class PaymentTermsEntity {
  @PrimaryGeneratedColumn('identity')
  id!: number;

  @Column()
  name!: string;

  @Column()
  days!: number;

  // Invoice relation
  @OneToMany(() => InvoiceEntity, (invoice) => invoice.paymentTerm)
  invoices!: InvoiceEntity[];
}
