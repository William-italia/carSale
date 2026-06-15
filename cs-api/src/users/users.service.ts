import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UserResponseDto } from './dtos/user-response.dto';
import { UpdateUserData } from './types/update-user-data';
import { UserMapper } from './mappers/user-mapper';
import { HashService } from '@src/cryptography/hash.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserData } from './types/create-user-data';

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly bcrypt: HashService
    ) {}

    async find() {
        const users = await this.usersRepo.find();
        return UserMapper.toResponseListDto(users);
    }

    async findOne(id: string) {
        const user = await this.usersRepo.findOne(id);
        return UserMapper.toResponseDto(user);
    }

    async create(dto: CreateUserDto): Promise<UserResponseDto> {

        await this.usersRepo.ensureEmailAvailable(dto.email)

        const data: CreateUserData = {
            email: dto.email,
            passwordHash: await this.bcrypt.hash(dto.password),
            // trocar quando JWT estiver funcionando
            tokenHash: await this.bcrypt.hash('teste')
        }

        const user = await this.usersRepo.create(data);

        return UserMapper.toResponseDto(user);
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {

        const user = await this.usersRepo.findOne(id);

        const data:UpdateUserData = {}
        
        if(dto.email) {
            await this.usersRepo.ensureEmailAvailable(dto.email, user.id);
            data.email = dto.email;
        }

        if(dto.password) {
            // posteriormente isso vai ter um endpoint proprio em auth/reset-password, ai eu faço um update decente
            data.passwordHash = await this.bcrypt.hash(dto.password);
        }

        const updated = await this.usersRepo.update(user, data);
        return UserMapper.toResponseDto(updated);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepo.remove(id);
    }

}
