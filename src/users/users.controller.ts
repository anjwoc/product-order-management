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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dto/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: UserRegisterDto,
  })
  register(@Body() userRegisterDto: UserRegisterDto): Promise<void> {
    return this.usersService.register(userRegisterDto);
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: UserLoginDto,
  })
  login(@Body() userLoginDto: UserLoginDto) {
    return this.usersService.verifyUserAndSignJwt(userLoginDto);
  }

  @Get()
  @ApiPaginatedResponse(UserDto)
  @ApiOperation({ summary: '회원 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    // type: PageDto<UserDto>,
  })
  getUserList(@Query() userPaginationDto: UserPaginationDto) {
    return this.usersService.findAll(userPaginationDto);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
