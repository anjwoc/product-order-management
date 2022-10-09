import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Order } from 'src/orders/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'User' })
export class User extends CommonEntity {
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

  @ApiProperty({
    description: '주문 목록',
    required: false,
    type: () => [Order],
  })
  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];
}
