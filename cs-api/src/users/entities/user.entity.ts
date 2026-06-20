import {Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn, Generated, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, BeforeRemove } from "typeorm"


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    name!: string

    @Column()
    passwordHash!: string;

    @Column()
    tokenHash?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @AfterInsert()
    logInser() {
        console.log('Inserted user with id: ' + this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Update user with id: ' + this.id);
    }

    @BeforeRemove()
    logRemove() {
        console.log('delete user with id: ' + this.id);
    }
}