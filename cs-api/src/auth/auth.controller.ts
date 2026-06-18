import { Controller, Post, Get, Patch, Body, Headers, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UpdatePasswordAuthDto } from './dtos/update-password-auth.dto';
import { UpdateUserDto } from '@src/users/dtos/update-user.dto';
import { UserResponseDto } from '@src/users/dtos/user-response.dto';
import { EmailValidationDto } from './dtos/email-auth.dto';
import { UpdatePasswordDto } from '@src/users/dtos/update-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor (
        private readonly authService: AuthService
    ) {}

    @Post('register')
    @ApiCreatedResponse({
        description: 'User created successfully'
    })
    register(@Body() body: RegisterAuthDto): Promise<void> {
        return this.authService.register(body);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: 200, type: AuthResponseDto})
    login(@Body() body: LoginAuthDto): Promise<AuthResponseDto> {
        return this.authService.login(body);
    }
    
    @Post('refresh-token') 
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: 200, type: AuthResponseDto})
    refreshToken() {}
       
    @Post('forgot-password') 
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: 200, description: 'Reset password link sent successfully!'})
    forgotPassword(@Body() body: EmailValidationDto) {
        return this.authService.forgotPassword(body);
    }

    @Post('reset-password') 
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: 200, description: 'Password updated successfully!'})
    resetPassword(@Headers('authorization') auth: string, @Body() body: UpdatePasswordDto) {
        return this.authService.resetPassword(auth, body);
    }

    @Get('me')
    @ApiResponse({type: UserResponseDto})
    me(@Headers('authorization') auth: string): Promise<UserResponseDto> {
        return this.authService.find(auth);
    }

    @Patch('me')
    @ApiResponse({type: UserResponseDto})
    updateMe(@Headers('authorization') auth: string, @Body() body: UpdateUserDto): Promise<UserResponseDto> {
        return this.authService.updateUser(auth, body);
    }

    @Patch('me/password')
    @ApiResponse({
    status: 200,
    description: 'Password updated successfully'
    })
    changePassword(@Headers('authorization') auth: string, @Body() body: UpdatePasswordAuthDto): Promise<void> {
        return this.authService.updatePassword(auth, body);
    }
  
    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({description: 'User successfully removed!'})
    deleteMe(@Headers('authorization') auth: string): Promise<void> {
        return this.authService.delete(auth);
    }
}
