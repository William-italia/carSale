import {Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn, Generated, PrimaryGeneratedColumn } from "typeorm"


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    passwordHash!: string;

    @Column()
    tokenHash!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}