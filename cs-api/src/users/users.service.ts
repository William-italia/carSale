import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserData } from './types/create-user-data';
import { UserResponseDto } from './dtos/user-response.dto';
import { UpdateUserData } from './types/update-user-data';
import { UserMapper } from './mappers/user-mapper';

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepo: UsersRepository,
    ) {}

    async find() {
        return this.usersRepo.find();
    }

    async findOne(id: string) {
        const user = await this.usersRepo.findOne(id);

        if(!user) {
            throw new NotFoundException('User not found');
        }

        return UserMapper.toResponseDto(user);
    }

    async create(data: CreateUserData): Promise<UserResponseDto> {

        const user = await this.usersRepo.create(data);

        return UserMapper.toResponseDto(user);

    }

    async update(id: string, data: UpdateUserData): Promise<UserResponseDto> {
                
        const user = await this.usersRepo.update(id, data);

        if(!user){
            throw new NotFoundException('User not found');
        }

        return UserMapper.toResponseDto(user);
    }

    async remove(id: string) {
        return this.usersRepo.remove(id);
    }

}
