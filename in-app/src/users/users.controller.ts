import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserParamDto } from '@users/dtos/find-user-params.dto';
import {
  ListUsersResponseDto,
  UserResponseDto,
} from '@users/dtos/user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: ListUsersResponseDto })
  findAllUsers(): Promise<ListUsersResponseDto> {
    return this.usersService.find();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID of user',
    example: 'f5ca7bc4-2c2e-475b-b5ea-4440270dde7d',
  })
  @ApiOkResponse({ type: UserResponseDto })
  findUser(@Param() param: FindUserParamDto): Promise<UserResponseDto> {
    return this.usersService.findOne(param.id);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserResponseDto })
  createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(body);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID of user',
    example: 'f5ca7bc4-2c2e-475b-b5ea-4440270dde7d',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  updateUser(
    @Param() param: FindUserParamDto,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(param.id, body);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID of user',
    example: 'a2695b96-fb9b-4d1d-a6cb-e7a7948aff81',
  })
  @ApiNoContentResponse({ description: 'User removed with successfully' })
  removeUser(@Param() param: FindUserParamDto): Promise<void> {
    return this.usersService.remove(param.id);
  }
}
