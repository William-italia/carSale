import { ApiProperty } from '@nestjs/swagger';
import { UpdatePasswordDto } from '@src/users/dtos/update-password.dto';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordAuthDto extends UpdatePasswordDto {
  // curPass, newPass, confPass
  @ApiProperty({
    description: 'The current password of user',
    example: '1234',
    minLength: 4,
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(14)
  currentPassword!: string;
}
