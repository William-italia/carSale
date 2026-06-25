import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  // newPass, confPass
  @ApiProperty({
    description: 'The password of user',
    example: '1234',
    minLength: 4,
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(14)
  newPassword!: string;

  @ApiProperty({
    description: 'The confirm password of user',
    example: '1234',
    minLength: 4,
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(14)
  confirmPassword!: string;
}
