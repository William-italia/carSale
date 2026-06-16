import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UserResponseDto } from './dtos/user-response.dto';
import { UpdateUserData } from './types/update-user-data';
import { UserMapper } from './mappers/user-mapper';
import { HashService } from '@src/cryptography/hash.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserData } from './types/create-user-data';
import { UserNotFoundError } from '@src/errors/user-not-found.error';
import { EmailAlreadyExistsError } from '@src/errors/email-already-exists.error';

@Injectable()
export class UsersService {

    constructor(
        private readonly userRepository: UsersRepository,
        private readonly bcrypt: HashService
    ) {}

    async find() {
        const users = await this.userRepository.find();
        return UserMapper.toResponseListDto(users);
    }

    async findOne(id: string) {
        const user = await this.userRepository.findById(id);

        if(!user) {
            throw new UserNotFoundError();
        }
        
        return UserMapper.toResponseDto(user);
    }

    async create(dto: CreateUserDto): Promise<UserResponseDto> {

        if(await this.userRepository.findByEmail(dto.email)) throw new EmailAlreadyExistsError();

        const data: CreateUserData = {
            email: dto.email,
            passwordHash: await this.bcrypt.hash(dto.password),
            // trocar quando JWT estiver funcionando
            tokenHash: await this.bcrypt.hash('teste')
        }

        const user = await this.userRepository.create(data);

        return UserMapper.toResponseDto(user);
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {

        const user = await this.userRepository.findById(id);
        
        if(!user) {
            throw new UserNotFoundError();
        }

        if(dto.email) {            

            const emailExists = await this.userRepository.findByEmailExcludingId(dto.email, user.id);

            if(emailExists) {
                throw new EmailAlreadyExistsError();
            }
        }
        
        if(dto.password) {
            dto.password = await this.bcrypt.hash(dto.password);
        }

        const data: UpdateUserData = {
            ...(dto.email && {email: dto.email}),
            ...(dto.password && {passwordHash: dto.password})
        };

        const updated = await this.userRepository.update(user, data);
        return UserMapper.toResponseDto(updated);
    }

    async remove(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);

        if(!user) {
            throw new UserNotFoundError();
        }

        await this.userRepository.remove(user.id);
    }

}
