import { Injectable, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UsersService } from '@src/users/users.service';
import { UserResponseDto } from '@src/users/dtos/user-response.dto';
import { UpdatePasswordAuthDto } from './dtos/update-password-auth.dto';
import { UpdateUserDto } from '@src/users/dtos/update-user.dto';
import { EmailValidationDto } from './dtos/email-auth.dto';
import { UpdatePasswordDto } from '@src/users/dtos/update-password.dto';
import { BcryptHash } from '@src/cryptography/bcrypt-hash.service';
import { UserEntity } from '@src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwtpayload-auth.data';


@Injectable()
export class AuthService {

    constructor (
        private readonly userRepository: UsersRepository,
        private readonly usersService: UsersService,
        private readonly bcrypt: BcryptHash,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(dto: RegisterAuthDto): Promise<void> {
    
        await this.usersService.create({
            email: dto.email,
            name: dto.name,
            password: dto.password,
            confirmPassword: dto.confirmPassword
        });

        // TODO: generate token and send email for verify 
        return;
    }

    async signIn(dto: LoginAuthDto): Promise<{access_token: string}> {

        const user = await this.validateCredentials(dto);

        // TODO
        // const refreshToken = 'yyyy';

        const payload = { sub: user.id }
        const accessToken = await this.jwtService.signAsync<JwtPayload>(payload);

        // res.cookie('refresh_token', 'token_aqui', {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        // });

        return {
            access_token: accessToken
        }
    }

    async find(payload: JwtPayload): Promise<UserResponseDto> {
        const user = await this.usersService.findOne(payload.sub);
        return user;
    }

    async updateUser(payload: JwtPayload, dto: UpdateUserDto): Promise<UserResponseDto> {
        const userUpdated = this.usersService.updateUser(payload.sub, dto);
        return userUpdated;
    }

    async updatePassword(payload: JwtPayload, dto: UpdatePasswordAuthDto): Promise<void> {
        await this.usersService.updateOwnPassword(payload.sub, dto);
    }


    async forgotPassword(dto: EmailValidationDto): Promise<string> {

        const user = await this.userRepository.findByEmail(dto.email);

        if(!user) {
            throw new NotFoundException('User not found!')
        }

        // TODO: generate reset token and send email
        return `Bearer ${user.id}`;
    }

    async resetPassword(payload: JwtPayload, dto: UpdatePasswordDto): Promise<void> {
        await this.usersService.updateUserPassword(payload.sub, dto);
    }

    async delete(payload: JwtPayload): Promise<void> {
        await this.usersService.remove(payload.sub);
    }


    private async validateCredentials(dto: LoginAuthDto): Promise<UserEntity> {
        
        const user = await this.userRepository.findByEmail(dto.email);

        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValidPassword = await this.bcrypt.compare(dto.password, user.passwordHash);

        if(!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        return user;
    }


}
