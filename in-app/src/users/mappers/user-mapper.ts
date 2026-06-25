import {
  ListUsersResponseDto,
  UserResponseDto,
} from '../dtos/user-response.dto';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  static toResponseListDto(users: UserEntity[]): ListUsersResponseDto {
    return {
      data: users.map((user) => this.toResponseDto(user)),
    };
  }
}
