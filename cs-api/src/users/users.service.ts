import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { ListUsersResponseDto, UserResponseDto } from './dtos/user-response.dto';
import { UpdateUserData } from './types/update-user-data';
import { UserMapper } from './mappers/user-mapper';
import { HashService } from '@src/cryptography/hash.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserNotFoundError } from '@src/errors/user-not-found.error';
import { EmailAlreadyExistsError } from '@src/errors/email-already-exists.error';
import { LoginAuthDto } from '@src/auth/dtos/login-auth.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdatePasswordAuthDto } from '@src/auth/dtos/update-password-auth.dto';
import { log } from 'console';
import { NotFoundError } from 'rxjs';
import { UnauthorizedError } from '@src/errors/Unauthorized.error';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        private readonly userRepository: UsersRepository,
        private readonly bcrypt: HashService
    ) {}

    async find(): Promise<ListUsersResponseDto> {
        const users = await this.userRepository.find();
        return UserMapper.toResponseListDto(users);
    }

    async findOne(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);

        if(!user) {
            throw new UserNotFoundError();
        }
        
        return UserMapper.toResponseDto(user);
    }

    async validateUser(dto: LoginAuthDto): Promise<UserEntity | null> {
        
        const userExists = await this.userRepository.findByEmail(dto.email);

        if(!userExists) {
            return null;
        }

        if(!(await this.bcrypt.compare(dto.password, userExists.passwordHash))) {
            return null;
        }
        
        return userExists;
    }


    async create(dto: CreateUserDto): Promise<UserResponseDto> {

        if(await this.userRepository.findByEmail(dto.email)) throw new EmailAlreadyExistsError();

        if(dto.password != dto.passwordConfirm) {
            throw new ConflictException('Passwords dont match');
        }

        const user = await this.userRepository.create({
            email: dto.email,
            name: dto.name,
            passwordHash: await this.bcrypt.hash(dto.password),
            tokenHash: await this.bcrypt.hash('teste')
        });

        return UserMapper.toResponseDto(user);
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {

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
        
        const updated = await this.userRepository.update(user, {
            ...(dto.email && {email: dto.email}),
            ...(dto.name && {name: dto.name})
        });

        return UserMapper.toResponseDto(updated);
    }

    async updateOwnPassword(id: string, dto: UpdatePasswordAuthDto) {
            
        const user = await this.userRepository.findById(id);

        if(!user) {
            throw new UserNotFoundError();
        }

        if(!await this.bcrypt.compare(dto.currentPassword, user.passwordHash)) {
            throw new UnauthorizedError();
        }

        if(dto.newPassword !== dto.confirmPassword) {
            throw new ConflictException('Passwords dont match');
        }

        const userUpdated = await this.userRepository.update(user, {
            passwordHash: (await this.bcrypt.hash(dto.newPassword))
        })

        return UserMapper.toResponseDto(userUpdated);

    }

    //admin / reset-password
    async updateUserPassword(id: string, dto: UpdatePasswordDto) {
        
        const user = await this.userRepository.findById(id);

        if(!user) {
            throw new UserNotFoundError();
        }

        if(dto.newPassword !== dto.confirmPassword) {
            throw new ConflictException('Passwords dont match');
        }

        await this.userRepository.update(user,
            {passwordHash: await this.bcrypt.hash(dto.newPassword)}
        );
    }

    async remove(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);

        if(!user) {
            throw new UserNotFoundError();
        }

        await this.userRepository.remove(user.id);
    }
}