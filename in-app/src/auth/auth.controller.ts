import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UpdatePasswordAuthDto } from './dtos/update-password-auth.dto';
import { UpdateUserDto } from '@src/users/dtos/update-user.dto';
import { UserResponseDto } from '@src/users/dtos/user-response.dto';
import { EmailValidationDto } from './dtos/email-auth.dto';
import { UpdatePasswordDto } from '@src/users/dtos/update-password.dto';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './params/token-payload.param';
import { TokenPayloadDto } from './dtos/token-payload.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signUp
  @Post('signUp')
  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  signUp(@Body() body: RegisterAuthDto): Promise<void> {
    return this.authService.signUp(body);
  }

  // signIn
  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, type: AuthResponseDto })
  signIn(@Body() body: LoginAuthDto): Promise<{ access_token: string }> {
    return this.authService.signIn(body);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, type: AuthResponseDto })
  refreshToken() {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Reset password link sent successfully!',
  })
  forgotPassword(@Body() body: EmailValidationDto) {
    return this.authService.forgotPassword(body);
  }

  @UseGuards(AuthGuard)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Password updated successfully!' })
  resetPassword(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.authService.resetPassword(currentUser, body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiResponse({ type: UserResponseDto })
  me(@CurrentUser() currentUser: TokenPayloadDto): Promise<UserResponseDto> {
    return this.authService.find(currentUser);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  @ApiResponse({ type: UserResponseDto })
  updateMe(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.authService.updateUser(currentUser, body);
  }

  @UseGuards(AuthGuard)
  @Patch('me/password')
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
  })
  changePassword(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Body() body: UpdatePasswordAuthDto,
  ): Promise<void> {
    return this.authService.updatePassword(currentUser, body);
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ description: 'User successfully removed!' })
  deleteMe(@CurrentUser() currentUser: TokenPayloadDto): Promise<void> {
    return this.authService.delete(currentUser);
  }
}
