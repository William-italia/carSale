import { UsersRepository } from './users.repository';
import { UserEntity } from '../entities/user.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserData } from '../types/create-user.data';
import { UpdateUserData } from '../types/update-user.data';

@Injectable()
export class TypeOrmUsersRepository extends UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super();
  }

  async find(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ email });
  }

  async findByEmailExcludingId(email: string, excludeId: string) {
    return await this.repository.findOne({
      where: {
        email: email,
        id: Not(excludeId),
      },
    });
  }

  async create(body: CreateUserData): Promise<UserEntity> {
    const user = this.repository.create(body);
    return this.repository.save(user);
  }

  async update(user: UserEntity, body: UpdateUserData): Promise<UserEntity> {
    Object.assign(user, body);
    return this.repository.save(user);
  }

  async getTokenHash(id: string): Promise<string | null> {
    const token = await this.repository.findOne({
      where: {
        id: id,
      },
      select: {
        tokenHash: true,
      },
    });

    if (!token) return null;

    return token?.tokenHash;
  }

  async remove(user: UserEntity): Promise<void> {
    await this.repository.remove(user);
  }
}
