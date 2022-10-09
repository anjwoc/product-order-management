import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserDto } from './dto/user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { ApiResponseDto } from 'src/common/decorators/response-dto.decorator';
import { PageDto } from 'src/common/dto/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponseDto(RegisterResponseDto)
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  register(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.usersService.register(userRegisterDto);
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인' })
  @ApiResponseDto(UserLoginDto)
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
  })
  login(@Body() userLoginDto: UserLoginDto) {
    return this.usersService.verifyUserAndSignJwt(userLoginDto);
  }

  @Get()
  @ApiOperation({ summary: '회원 전체 조회' })
  @ApiResponseDto(PageDto<UserDto>)
  @ApiResponse({
    status: 200,
    description: '조회 성공',
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
