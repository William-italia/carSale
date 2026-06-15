import { UserEntity } from "../entities/user.entity";
import { CreateUserData } from "../types/create-user-data";


export abstract class UsersRepository {

    abstract find(): Promise<UserEntity[]>;
    abstract findOne(id: string): Promise<UserEntity>;
    abstract ensureEmailAvailable(email: string, ignoreId?: string): Promise<void>;
    abstract create(body: CreateUserData): Promise<UserEntity>;
    abstract update(user: UserEntity, body: Partial<UserEntity>): Promise<UserEntity>;
    abstract remove(id: string): Promise<void>;

}