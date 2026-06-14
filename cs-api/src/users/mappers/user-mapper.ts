import { UserResponseDto } from "../dtos/user-response.dto";
import { UserEntity } from "../entities/user.entity";

export class UserMapper {

    static toResponseDto(user: UserEntity): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            password: user.passwordHash,
            tokenHash: user.tokenHash,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toDateString()
        }
    }


}