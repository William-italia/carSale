import { UserEntity } from '../entities/user.entity';
import { CreateUserData } from '../types/create-user-data';
import { UpdateUserData } from '../types/update-user-data';

export abstract class UsersRepository {
  abstract find(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByEmailExcludingId(
    email: string,
    excludeId: string,
  ): Promise<UserEntity | null>;
  abstract create(body: CreateUserData): Promise<UserEntity>;
  abstract update(user: UserEntity, body: UpdateUserData): Promise<UserEntity>;
  abstract remove(user: UserEntity): Promise<void>;
}
