import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Order } from 'src/orders/order.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'Product' })
export class Product extends CommonEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'integer', nullable: false })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'integer', nullable: false })
  stockQuantity: number;

  @ManyToMany(() => Order, (orders) => orders.products)
  orders: Order[];

  // @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.product)
  // orderProudcts: OrderProducts[];
}
