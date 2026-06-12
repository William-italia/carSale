import {Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn, Generated, PrimaryGeneratedColumn } from "typeorm"


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    passwordHash!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}