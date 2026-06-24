import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
    //email, password

    @ApiProperty({
        description: "The email of user",
        example: "william@example.com"
    })
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @ApiProperty({
        description: "The password of user",
        example: "bananinha@123$",
        maxLength: 14,
        minLength: 4
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(14)
    password!: string 
}