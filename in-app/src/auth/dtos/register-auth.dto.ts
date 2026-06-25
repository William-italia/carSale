import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  // email, name, pass, confPass
  @ApiProperty({
    description: 'The email of user',
    example: 'william@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'The nickname of user',
    example: 'William italia',
    maxLength: 25,
    minLength: 8,
  })
  @IsString()
  @MaxLength(25)
  @MinLength(4)
  name!: string;

  @ApiProperty({
    description: 'The password of user',
    example: 'bananinha@123$',
    maxLength: 14,
    minLength: 4,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(14)
  password!: string;

  @ApiProperty({
    description: 'Password confirm',
    example: 'bananinha@123$',
    maxLength: 14,
    minLength: 4,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(14)
  confirmPassword!: string;
}
