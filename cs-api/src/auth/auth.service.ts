import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UsersService } from '@src/users/users.service';
import { UserResponseDto } from '@src/users/dtos/user-response.dto';
import { UpdatePasswordAuthDto } from './dtos/update-password-auth.dto';
import { UpdateUserDto } from '@src/users/dtos/update-user.dto';
import { EmailValidationDto } from './dtos/email-auth.dto';
import { UpdatePasswordDto } from '@src/users/dtos/update-password.dto';

@Injectable()
export class AuthService {

    constructor (
        private readonly userRepository: UsersRepository,
        private readonly usersService: UsersService,
    ) {}

    extractToken(token: string): string {
        
        if (!token) {
            throw new UnauthorizedException('Authorization header not provided');
        }

        const authHeader = token.split(' ')[1];

        if (!authHeader) {
            throw new UnauthorizedException('Invalid authorization format');
        }

        return authHeader;
    }

    async register(dto: RegisterAuthDto): Promise<void> {
    
        await this.usersService.create({
            email: dto.email,
            name: dto.name,
            password: dto.password,
            passwordConfirm: dto.passwordConfirm
        });

        // TODO: generate token and send email for verify 
    }

    async login(dto: LoginAuthDto): Promise<AuthResponseDto> {

        const user = await this.usersService.validateUser(dto);
        
        if(!user) {
             throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = 'xxxx';
        const refreshToken = 'yyyy';

        return AuthMapper.toResponseDto(
            user,
            accessToken,
            refreshToken
        );
    }

    async find(header: string): Promise<UserResponseDto> {

        const authHeader = this.extractToken(header);
        const user = await this.usersService.findOne(authHeader);

        return user;
    }

    async updateUser(header: string, dto: UpdateUserDto): Promise<UserResponseDto> {

        const token = this.extractToken(header);
        const userUpdated = this.usersService.updateUser(token, dto);

        return userUpdated;
    }

    async updatePassword(header: string, dto: UpdatePasswordAuthDto): Promise<void> {
        const token = this.extractToken(header);
        await this.usersService.updateOwnPassword(token, dto);
    }


    async forgotPassword(dto: EmailValidationDto): Promise<string> {

        const user = await this.userRepository.findByEmail(dto.email);

        if(!user) {
            throw new NotFoundException('User not found!')
        }

        // TODO: generate reset token and send email
        return `Bearer ${user.id}`;
    }

    async resetPassword(header: string, dto: UpdatePasswordDto): Promise<void> {
        const token = this.extractToken(header);
        await this.usersService.updateUserPassword(token, dto);
    }

    async delete(header: string): Promise<void> {
        const token = this.extractToken(header);
        await this.usersService.remove(token);
    }

}
