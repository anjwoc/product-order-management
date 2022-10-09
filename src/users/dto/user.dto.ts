import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { User } from '../user.entity';

// export class UserDto extends OmitType(User, ['orders', 'password']) {}
export class UserDto {
  @ApiProperty({ type: 'string', description: '이메일' })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @ApiProperty({ type: 'string', description: '이름' })
  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  username: string;

  @ApiProperty({ type: 'string', description: '비밀번호' })
  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty({ type: 'string', description: '전화번호' })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  phoneNumber: string;

  @ApiProperty({ type: 'string', description: '관리자 여부' })
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;
}
