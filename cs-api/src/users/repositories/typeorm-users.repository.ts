import { UsersRepository } from "./users.repository";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CreateUserData } from "../types/create-user-data";

@Injectable()
export class TypeOrmUsersRepository extends UsersRepository {

    constructor (
        @InjectRepository(UserEntity)
        private readonly repo: Repository<UserEntity>
    ) {
        super();
    }

    async find(): Promise<UserEntity[]> {
        return this.repo.find();
    }

    async findOne(id: string): Promise<UserEntity | null> {
        return this.repo.findOneBy({id});
    }

    async findOneByEmail(email: string): Promise<UserEntity | null> {
        return this.repo.findOneBy({email});
    }

    async create(body: CreateUserData): Promise<UserEntity> {
        return this.repo.save(body);
    }

    async update(id: string, body: Partial<UserEntity>): Promise<UserEntity | null> {
        await this.repo.update(id, body);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.repo.delete(id);
    }

}