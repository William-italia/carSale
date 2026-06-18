import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: "The email of user",
        example: "john@example.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({
        description: "The nickname of user",
        example: "William italia",
        maxLength: 25,
        minLength: 8
    })
    @IsString()
    @MaxLength(25)
    @MinLength(4)
    name!: string

    @ApiProperty({
        description: "The password of user",
        example: "1234",
        minLength: 4,
        maxLength: 64,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(14)
    password!: string;

}