import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email of user',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'The nickname of user',
    example: 'William italia',
    maxLength: 25,
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  @MinLength(4)
  name?: string;

  // in the future, there will be an avatar/image field
}

