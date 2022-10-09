import {
  Catch,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { PageDto } from 'src/common/dto/pagination.dto';
import { UserDto } from './dto/user.dto';
import { PageMetaDto } from 'src/common/dto/pagination-meta.dto';
import bcrypt from 'bcrypt';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,

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
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
