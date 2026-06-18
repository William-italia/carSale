import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailValidationDto {
    @ApiProperty({
            description: "The email of user",
            example: "john@example.com",
        })
    @IsEmail()
    @IsNotEmpty()
    email!: string
}