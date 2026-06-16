import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "@src/users/dtos/user-response.dto";

export class AuthResponseDto {


    @ApiProperty({
        description: "The token JWT of user",
        example: "xxxx"
    })
    accessToken!: string;

    @ApiProperty({
        description: "The refresh token JWT of user",
        example: "yyyy"
    })
    refreshToken!: string;

   @ApiProperty({
    description: "Object of user",
    example: {
        id: "123",
        email: "user@example.com",
        createdAt: "2026-06-16T12:00:00.000Z",
        updatedAt: "2026-06-16T12:00:00.000Z",
    }
    })
    user!: UserResponseDto;
}