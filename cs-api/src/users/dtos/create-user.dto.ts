import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(40)
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(64)
    password!: string;

}