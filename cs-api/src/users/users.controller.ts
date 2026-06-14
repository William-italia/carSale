import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserParamDto } from '@users/dtos/find-user-params.dto';
import { ListUsersResponseDto, UserResponseDto } from '@users/dtos/user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) {}


    @Get()
    @ApiOkResponse({type: ListUsersResponseDto})
    findAllUsers(): unknown {
        return this.usersService.find();
    }

    @Get(':id')
    //documentando os parametros
    @ApiParam({ name: 'id', type: String, description: 'UUID of user', example: '70a11139-62ea-4ed8-8524-bbb455fb11fa' })
    //documentando a resposta
    @ApiOkResponse({type: UserResponseDto})
    findUser(@Param() param: FindUserParamDto): unknown
    {
        return this.usersService.findOne(param.id);
    }

    @Post()
    @ApiBody({type: CreateUserDto})
    @ApiCreatedResponse({type: UserResponseDto})
    createUser(@Body() body: CreateUserDto): unknown {
        return this.usersService.create(body);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', type: String, description: 'UUID of user', example: '70a11139-62ea-4ed8-8524-bbb455fb11fa' })
    @ApiBody({type: UpdateUserDto})
    @ApiOkResponse({type: UserResponseDto})
    updateUser(
        @Param() param: FindUserParamDto,
        @Body() body: UpdateUserDto
    ): unknown {
        return this.usersService.update(param.id, body);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: String, description: 'UUID of user', example: '70a11139-62ea-4ed8-8524-bbb455fb11fa' })
    @ApiNoContentResponse({description: 'User removed with successfully'})
    removeUser(@Param() param: FindUserParamDto): unknown {
        return this.usersService.remove(param.id);
    }

}
