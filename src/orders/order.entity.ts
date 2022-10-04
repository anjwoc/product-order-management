import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { OrderStatus } from './order.status';

@Entity({ name: 'Order' })
export class Order extends CommonEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverName: string;

  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverPhone: string;

  @IsString()
  @Column({ type: 'varchar', nullable: false })
  receiverAddress: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: OrderStatus,
    default: OrderStatus.READY,
  })
  orderStatus: OrderStatus;

  @ManyToOne(() => User, (users) => users.orders)
  user: User;

  // @ManyToMany(() => Product, (product) => product.orders)
  // @JoinTable({
  //   name: 'OrderProducts',
  //   joinColumn: { name: 'product_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'order_id', referencedColumnName: 'id' },
  // })
  // products: Product[];

  // @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.order)
  // orderProudcts: OrderProducts[];

  @ManyToMany(() => Product, (products) => products.orders, {
    cascade: true,
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
