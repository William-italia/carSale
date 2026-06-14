import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: "The email of user",
        example: "john@example.com",
        maxLength: 40,
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(40)
    email!: string;

    @ApiProperty({
        description: "The password of user",
        example: "1234",
        minLength: 4,
        maxLength: 64,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(64)
    password!: string;


    // @ApiProperty({
    //     description: "token temp of user",
    //     example: "teste"
    // })
    // @IsString()
    // token!: string; 

}