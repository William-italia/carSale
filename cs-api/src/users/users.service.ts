import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UsersService {


    constructor() {}

    find() {
        return [];
    }
    findOne(id): UserResponseDto {
        return {
            id: 'uuid',
            email: "meu email",
            createdAt: "2026-06-12T10:00:00.000Z",
            updatedAt: "2026-06-12T10:00:00.000Z"
        }

    }
    create(body) {
          return {
            id: 'uuid',
            email: "meu email",
            createdAt: "2026-06-12T10:00:00.000Z",
            updatedAt: "2026-06-12T10:00:00.000Z"
        }
    }
    update(id, body) {
          return {
            id: 'uuid',
            email: "meu email",
            createdAt: "2026-06-12T10:00:00.000Z",
            updatedAt: "2026-06-12T10:00:00.000Z"
        }
    }
    remove(id) {
        console.log('to aqui');
    }



}
