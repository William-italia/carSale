import { UsersRepository } from "./users.repository";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-user.dto";

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

    async create(body: CreateUserDto): Promise<UserEntity> {
        return this.repo.save(body);
    }

    async update(id: string, body: Partial<UserEntity>): Promise<void> {
        await this.repo.update(id, body);
    }

    async remove(id: string): Promise<void> {
        await this.repo.delete(id);
    }

}