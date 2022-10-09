import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/pagination.decorator';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserDto } from './dto/user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  register(@Body() userRegisterDto: UserRegisterDto) {
    return this.usersService.register(userRegisterDto);
  }

  @Post('/login')
  login(@Body() userLoginDto: UserLoginDto) {
    return this.usersService.verifyUserAndSignJwt(userLoginDto);
  }

  @Get()
  @ApiPaginatedResponse(UserDto)
  getUserList(@Query() userPaginationDto: UserPaginationDto) {
    return this.usersService.findAll(userPaginationDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
