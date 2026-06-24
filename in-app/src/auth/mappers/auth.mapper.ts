import { UserMapper } from "@src/users/mappers/user-mapper";
import { AuthResponseDto } from "../dtos/auth-response.dto";
import { UserResponseDto } from "@src/users/dtos/user-response.dto";
import { UserEntity } from "@src/users/entities/user.entity";

export class AuthMapper {
    
    static toResponseDto(user: UserEntity, accessToken: string, refreshToken: string): AuthResponseDto {

        return {
            accessToken,
            refreshToken,
            user: UserMapper.toResponseDto(user)
        }
    }

}