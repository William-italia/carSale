import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UserResponseDto } from './dtos/user-response.dto';
import { UpdateUserData } from './types/update-user-data';
import { UserMapper } from './mappers/user-mapper';
import { HashService } from '@src/cryptography/hash.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
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

    async validateUser(email: string, password: string): Promise<UserResponseDto | null> {
        
        const userExists = await this.userRepository.findByEmail(email);

        if(!userExists) {
            return null;
        }

        if(!(await this.bcrypt.compare(password, userExists.passwordHash))) {
            return null;
        }
        
        return UserMapper.toResponseDto(userExists);
    }


    async create(dto: CreateUserDto): Promise<UserResponseDto> {

        if(await this.userRepository.findByEmail(dto.email)) throw new EmailAlreadyExistsError();

        const user = await this.userRepository.create({
            email: dto.email,
            name: dto.name,
            passwordHash: await this.bcrypt.hash(dto.password),
            tokenHash: await this.bcrypt.hash('teste')
        });

        return UserMapper.toResponseDto(user);
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {

        if(!dto || Object.keys(dto).length === 0) {
            throw new BadRequestException('No fields filled in.');
        }

        const user = await this.userRepository.findById(id);
        
        if(!user) {
            throw new UserNotFoundError();
        }
     
        if(dto.email) {            
            if(await this.userRepository.findByEmailExcludingId(dto.email, user.id)) {
                throw new EmailAlreadyExistsError();
            }
        }
        
        if(dto.password) {
            dto.password = await this.bcrypt.hash(dto.password);
        }

        const updated = await this.userRepository.update(user, {
            ...(dto.email && {email: dto.email}),
            ...(dto.password && {passwordHash: dto.password}),
            ...(dto.name && {name: dto.name})
        });

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
