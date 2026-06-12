import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserParamDto } from '@users/dtos/find-user-params.dto';
import { UserResponseDto } from '@users/dtos/user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get('/')
    findAllUsers() {
        return this.usersService.find();
    }

    @Get('/:id')
    findUser(
        @Param() param: FindUserParamDto
    ) {
        return this.usersService.findOne(param.id);
    }

    @Post('/')
    createUser(
        @Body() dto: CreateUserDto
    ) {

        return this.usersService.create(dto);

    }

    @Patch('/:id')
    updateUser(
        @Param() param: FindUserParamDto,
        @Body() dto: UpdateUserDto
    ) {

        return this.usersService.update(param.id, dto);

    }

    @Delete('/:id')
    removeUser(
        @Param() param: FindUserParamDto
    ) {

        return this.usersService.remove(param.id);
        
    }

}
