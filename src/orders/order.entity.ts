import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { OrderStatus } from './order.status';

@Entity({ name: 'Order' })
export class Order extends CommonEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverName: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverPhone: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverAddress: string;

  @ApiProperty({
    name: 'orderStatus',
    enum: OrderStatus,
    enumName: 'OrderStatus',
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.READY,
  })
  orderStatus: OrderStatus;

  @ApiProperty({ type: () => [User] })
  @ManyToOne(() => User, (users) => users.orders)
  user: User;

  @ApiProperty({ type: () => [Product] })
  @ManyToMany(() => Product, (products) => products.orders, {
    cascade: true,
    onDelete: 'NO ACTION',
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
