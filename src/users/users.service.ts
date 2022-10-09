import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { PageDto } from 'src/common/dto/pagination.dto';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { PageMetaDto } from 'src/common/dto/pagination-meta.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,

    @InjectQueue('user')
    private userQueue: Queue,

    @InjectDataSource()
    private connection: DataSource,
  ) {}

  async register(userRegisterDto: UserRegisterDto): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { email, password } = userRegisterDto;

      const user = await this.usersRepository.findOne({ where: { email } });

      if (user) {
        throw new UnauthorizedException('이미 가입된 사용자가 존재합니다.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await queryRunner.manager.getRepository(User).save({
        ...userRegisterDto,
        password: hashedPassword,
      });

      await queryRunner.commitTransaction();

      this.userQueue.add('register', userRegisterDto);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async verifyUserAndSignJwt(
    userLoginDto: UserLoginDto,
  ): Promise<{ jwt: string; user: UserDto }> {
    const { email, password } = userLoginDto;
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('이메일과 일치하는 유저가 없습니다.');
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      throw new UnauthorizedException('로그인에 실패했습니다.');
    }
    try {
      const jwt = await this.jwtService.signAsync(
        {
          sub: user.id,
        },
        { secret: this.configService.get('SECRET_KEY') },
      );

      const loginedUser = { jwt, user };

      this.userQueue.add('login', loginedUser);

      return loginedUser;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findAll(pageOptionsDto: UserPaginationDto): Promise<PageDto<UserDto>> {
    const { take, skip, orderBy, isAdmin } = pageOptionsDto;
    const [users, itemCount] = await this.usersRepository.findAndCount({
      where: {
        isAdmin: isAdmin,
      },
      take: take,
      skip: skip,
      order: { createdAt: orderBy },
    });

    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(users, pageMeta);
  }

  async findUserById(id: number): Promise<UserDto> {
    if (!id) {
      throw new BadRequestException('사용자 아이디가 없습니다.');
    }

    const user = await this.usersRepository.findOne({ where: { id: id } });

    return user;
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
