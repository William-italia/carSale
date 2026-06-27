import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import {
  ListUsersResponseDto,
  UserResponseDto,
} from './dtos/user-response.dto';
import { UserMapper } from './mappers/user-mapper';
import { HashService } from '@src/cryptography/hash.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdatePasswordAuthDto } from '@src/auth/dtos/update-password-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly bcrypt: HashService,
  ) {}

  async find(): Promise<ListUsersResponseDto> {
    const users = await this.userRepository.find();
    return UserMapper.toResponseListDto(users);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found!',
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
      });
    }

    return UserMapper.toResponseDto(user);
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    if (await this.userRepository.findByEmail(dto.email))
      throw new ConflictException('Email already exists!');

    if (dto.password != dto.confirmPassword) {
      throw new ConflictException('Passwords dont match');
    }

    const user = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash: await this.bcrypt.hash(dto.password),
      // TODO: refresh token hash
      tokenHash: null,
      active: true,
    });

    return UserMapper.toResponseDto(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields filled in.');
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (dto.email) {
      if (
        await this.userRepository.findByEmailExcludingId(dto.email, user.id)
      ) {
        throw new ConflictException('Email already exists!');
      }
    }

    const updated = await this.userRepository.update(user, {
      ...(dto.email && { email: dto.email }),
      ...(dto.name && { name: dto.name }),
    });

    return UserMapper.toResponseDto(updated);
  }

  async updateOwnPassword(
    id: string,
    dto: UpdatePasswordAuthDto,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found!',
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
      });
    }

    if (!(await this.bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Invalid password');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new ConflictException("the passwords don't match");
    }

    await this.userRepository.update(user, {
      passwordHash: await this.bcrypt.hash(dto.newPassword),
    });

    return;
  }

  //admin / reset-password
  async updateUserPassword(id: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new ConflictException('Passwords dont match');
    }

    await this.userRepository.update(user, {
      passwordHash: await this.bcrypt.hash(dto.newPassword),
    });

    return;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.userRepository.remove(user);

    return;
  }
}
