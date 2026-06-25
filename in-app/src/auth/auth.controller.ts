import { Controller, Post, Get, Patch, Body, Delete, HttpStatus, HttpCode, UseGuards, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
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
import { authGuard } from './auth.guard';


@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor (
        private readonly authService: AuthService
    ) {}


    // signUp
    @Post('signUp')
    @ApiCreatedResponse({
        description: 'User created successfully'
    })
    signUp(@Body() body: RegisterAuthDto): Promise<void> {
        return this.authService.signUp(body);
    }

    // signIn
    @Post('signIn')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: 200, type: AuthResponseDto})
    signIn(
        @Body() body: LoginAuthDto,
    ): Promise<{access_token: string}> {
        return this.authService.signIn(body);
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

    @UseGuards(authGuard)
    @Post('reset-password') 
    @HttpCode(HttpStatus.OK)
    @ApiResponse({status: 200, description: 'Password updated successfully!'})
    resetPassword(@Request() req, @Body() body: UpdatePasswordDto) {
        return this.authService.resetPassword(req.user, body);
    }

    @UseGuards(authGuard)
    @Get('me')
    @ApiResponse({type: UserResponseDto})
    me(@Request() req): Promise<UserResponseDto> {
        return this.authService.find(req.user);
    }

    @UseGuards(authGuard)
    @Patch('me')
    @ApiResponse({type: UserResponseDto})
    updateMe(@Request() req, @Body() body: UpdateUserDto): Promise<UserResponseDto> {
        return this.authService.updateUser(req.user, body);
    }

    @UseGuards(authGuard)
    @Patch('me/password')
    @ApiResponse({
    status: 200,
    description: 'Password updated successfully'
    })
    changePassword(@Request() req, @Body() body: UpdatePasswordAuthDto): Promise<void> {
        return this.authService.updatePassword(req.user, body);
    }
  
    @UseGuards(authGuard)
    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({description: 'User successfully removed!'})
    deleteMe(@Request() req): Promise<void> {
        return this.authService.delete(req.user);
    }
}
