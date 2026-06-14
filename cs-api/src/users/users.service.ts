import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UserResponseDto } from './dtos/user-response.dto';
import { UpdateUserData } from './types/update-user-data';
import { UserMapper } from './mappers/user-mapper';
import { HashService } from '@src/cryptography/hash.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly bcrypt: HashService
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

    async create(dto: CreateUserDto): Promise<UserResponseDto> {

        const userExists = await this.usersRepo.findOneByEmail(dto.email);

        if(userExists) {
            throw new ConflictException('An account already exists with that email address');
        }

        const data = {
            email: dto.email,
            passwordHash: await this.bcrypt.hash(dto.password),
            // trocar quando JWT estiver funcionando
            tokenHash: await this.bcrypt.hash('teste')
        }

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
