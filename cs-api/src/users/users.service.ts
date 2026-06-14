import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { ListUsersResponseDto, UserResponseDto } from './dtos/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepo: UsersRepository
    ) {}

    find(): unknown {
        return this.usersRepo.find();
    }

    findOne(id: string) {
        return this.usersRepo.findOne(id);
    }

    create(data) {
        return this.usersRepo.create(data);
    }

    update(id, data) {
        return this.usersRepo.update(id, data);
    }

    remove(id) {
        return this.usersRepo.remove(id);
    }

}
