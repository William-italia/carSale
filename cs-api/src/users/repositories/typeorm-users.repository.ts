import { UsersRepository } from "./users.repository";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { CreateUserData } from "../types/create-user-data";
import { UpdateUserData } from "../types/update-user-data";
import { UserNotFoundError } from "@src/errors/user-not-found.error";
import { EmailAlreadyExistsError } from "@src/errors/email-already-exists.error";

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

    async findOne(id: string): Promise<UserEntity> {

        const user = await this.repo.findOneBy({id})

        if(!user) {
            throw new UserNotFoundError();
        }
        
        return user;
    }

    async ensureEmailAvailable(email: string, ignoreId?: string): Promise<void> {

        const user = await this.repo.findOneBy({email});

        if(user && user.id !== ignoreId) {
            throw new EmailAlreadyExistsError()
        }

    }

    async create(body: CreateUserData): Promise<UserEntity> {
        return this.repo.save(body);
    }

    async update(user: UserEntity, body: UpdateUserData): Promise<UserEntity> {

        Object.assign(user, body)
        return this.repo.save(user);        
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.repo.delete(id);
    }

}