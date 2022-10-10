import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { OrderStatus } from './order.status';

@Entity({ name: 'Order' })
export class Order extends CommonEntity {
  @ApiProperty({ type: 'string', description: '수령인 이름' })
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverName: string;

  @ApiProperty({ type: 'string', description: '수령인 전화번호' })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverPhone: string;

  @ApiProperty({ type: 'string', description: '수령인 주소' })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverAddress: string;

  @ApiProperty({
    name: 'orderStatus',
    enum: OrderStatus,
    enumName: 'OrderStatus',
    description: '주문 상태',
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.READY,
  })
  orderStatus: OrderStatus;

  @ApiProperty({ type: () => [User], description: '주문한 사람' })
  @ManyToOne(() => User, (users) => users.orders)
  user: User;

  @ApiProperty({ type: () => [Product], description: '주문 상품 리스트' })
  @ManyToMany(() => Product, (products) => products.orders, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'Order_Products',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Product[];
}
