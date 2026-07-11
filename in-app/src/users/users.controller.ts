import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from '@users/dtos/user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@src/security/auth.guard';
import { CurrentUser } from '@src/security/currentUser.param';
import { TokenPayloadDto } from '@src/auth/dtos/token-payload.dto';
import { UpdatePasswordAuthDto } from '@src/auth/dtos/update-password-auth.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiResponse({ type: UserResponseDto })
  me(@CurrentUser() currentUser: TokenPayloadDto): Promise<UserResponseDto> {
    return this.userService.findOne(currentUser.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  @ApiResponse({ type: UserResponseDto })
  updateMe(
    @CurrentUser() currentUser: TokenPayloadDto,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(currentUser.sub, body);
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
    return this.userService.updateOwnPassword(currentUser.sub, body);
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ description: 'User successfully removed!' })
  deleteMe(@CurrentUser() currentUser: TokenPayloadDto): Promise<void> {
    return this.userService.remove(currentUser.sub);
  }

  // endpoints for administration
  /*
  @Get()
  @ApiOkResponse({ type: ListUsersResponseDto })
  findAllUsers(): Promise<ListUsersResponseDto> {
    return this.userService.find();
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
    return this.userService.findOne(param.id);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserResponseDto })
  createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(body);
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
    return this.userService.updateUser(param.id, body);
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
    return this.userService.remove(param.id);
  }
  */
}
