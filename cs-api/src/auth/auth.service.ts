import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from '@src/cryptography/hash.service';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { EmailAlreadyExistsError } from '@src/errors/email-already-exists.error';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { LoginAuthDto } from './dtos/login-auth.dto';

@Injectable()
export class AuthService {

    constructor (
        private readonly userRepository: UsersRepository,
        private readonly bcrypt: HashService
    ) {}

    async register(dto: RegisterAuthDto): Promise<AuthResponseDto> {

        if(await this.userRepository.findByEmail(dto.email)) {
            throw new EmailAlreadyExistsError();
        }   

        if(dto.password != dto.passwordConfirm) {
            throw new ConflictException('Passwords dont match');
        }
        // if email not exists, send email confirmation with code or confirmation link etc..

        const user = await this.userRepository.create({
            email: dto.email,
            passwordHash: await this.bcrypt.hash(dto.password),
            tokenHash: await this.bcrypt.hash('12332'),
        });
    
        const accessToken = 'xxxx';
        const refreshToken = 'yyyy';

        return AuthMapper.toResponseDto(user, accessToken, refreshToken);
    }

    async login(dto: LoginAuthDto) {

        const user = await this.userRepository.findByEmail(dto.email);

        if(!user) {
            throw new UnauthorizedException('Email or Password invalid');
        }

        if(!(await this.bcrypt.compare(
            dto.password, 
            user.passwordHash
        ))) {
            throw new UnauthorizedException('Email or Password invalid');
        }

        const accessToken = 'xxxx';
        const refreshToken = 'yyyy';

        return AuthMapper.toResponseDto(
            user,
            accessToken,
            refreshToken
        );

    }
}
