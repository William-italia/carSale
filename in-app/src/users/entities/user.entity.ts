import { InvoiceEntity } from '@src/invoices/entities/invoice.entity';
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({
    type: 'text',
    name: 'token_hash',
    nullable: true,
    default: 'placeholder',
  })
  tokenHash!: string | null;

  // todo: CHANGE THE DEFAULT TO FALSE LATER.
  @Column({ default: true, nullable: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // invoice relation
  @OneToMany(() => InvoiceEntity, (invoice) => invoice.user)
  invoices!: InvoiceEntity[];
}
