import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
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

  @ManyToMany(() => Product, (products) => products.orders, {
    onDelete: 'NO ACTION',
  })
  @JoinTable()
  products: Product[];
}
