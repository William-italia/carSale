import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
    @ApiProperty({
        description: "The UUID of user",
        example: "uuid",
    })    
    id!: string;

    @ApiProperty({
        description: "The email of user",
        example: "john@example.com",
    }) 
    email!: string;

    @ApiProperty({
        description: "createdAt timeStamp",
        example: "2026-06-12T10:00:00.000Z",
    }) 
    createdAt!: string;

    @ApiProperty({
        description: "createdAt timeStamp",
        example: "2026-06-12T10:00:00.000Z",
    }) 
    updatedAt!: string;
}

export class ListUsersResponseDto  {
    @ApiProperty({
        type: UserResponseDto,
        isArray: true,
        example: [
             {
        id: "a1b2c3",
        email: "john@example.com",
        createdAt: "2026-06-12T10:00:00.000Z",
        updatedAt: "2026-06-12T10:00:00.000Z",
      },
      {
        id: "d4e5f6",
        email: "mary@example.com",
        createdAt: "2026-06-13T10:00:00.000Z",
        updatedAt: "2026-06-13T10:00:00.000Z",
      },
        ]
    })

    data!: UserResponseDto[];
}

