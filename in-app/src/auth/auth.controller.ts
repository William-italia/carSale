import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { EmailValidationDto } from './dtos/email-auth.dto';
import { UpdatePasswordDto } from '@src/users/dtos/update-password.dto';
import { TokenPayloadDto } from './dtos/token-payload.dto';
import { AuthGuard } from '@src/security/auth.guard';
import { CurrentUser } from '@src/security/currentUser.param';

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
}
