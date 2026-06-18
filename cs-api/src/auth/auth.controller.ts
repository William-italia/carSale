import { Controller, Post, Get, Patch, Body, Param, Headers, Delete, Req } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor (
        private readonly authService: AuthService
    ) {}

    @Post('register')
    @ApiBody({type: RegisterAuthDto}) // nn sei pra q serve
    @ApiCreatedResponse({type: AuthResponseDto}) // change for the future
    register(@Body() body: RegisterAuthDto): Promise<AuthResponseDto> {
        return this.authService.register(body);
    }

    @Post('login')
    @ApiCreatedResponse({type: AuthResponseDto})
    login(@Body() body: LoginAuthDto) {
        return this.authService.login(body);
    }
       
    @Post('forgot-password') 
    forgotPassword() {}

    @Post('reset-password') 
    resetPassword() {}

    @Post('refresh-token') 
    refreshToken() {}

    // /me
    @Get('me')
    me(@Headers('authorization') auth: string) {
        return this.authService.find(auth);
    }

    @Patch('me')
    updateMe(@Req() req: Request, @Body() body: {}) {
        console.log(req.headers);
    }

    @Patch('me/password/:id')
    changePassword() {}
  
    @Delete('me/:id')
    deleteMe() {}
}
