import { UserEntity } from "../entities/user.entity";
import { CreateUserData } from "../types/create-user-data";


export abstract class UsersRepository {

    abstract find(): Promise<UserEntity[]>;
    abstract findOne(id: string): Promise<UserEntity | null>;
    abstract create(body: CreateUserData): Promise<UserEntity>;
    abstract update(id: string, body: Partial<UserEntity>): Promise<UserEntity | null>;
    abstract remove(id: string): Promise<void>;

}