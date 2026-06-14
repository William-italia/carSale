import { UserEntity } from "../entities/user.entity";


export abstract class UsersRepository {

    abstract find(): Promise<UserEntity[]>;
    abstract findOne(id: string): Promise<UserEntity | null>;
    abstract create(body: UserEntity): Promise<UserEntity>;
    abstract update(id: string, body: Partial<UserEntity>): Promise<void>;
    abstract remove(id: string): Promise<void>;

}