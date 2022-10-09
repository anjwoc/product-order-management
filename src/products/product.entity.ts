import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Order } from 'src/orders/order.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'Product' })
export class Product extends CommonEntity {
  @ApiProperty({ type: 'string', description: '상품 이름' })
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ type: 'number', description: '상품 가격' })
  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'integer', nullable: false })
  price: number;

  @ApiProperty({ type: 'number', description: '상품 재고 수량' })
  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'integer', nullable: false })
  stockQuantity: number;

  @ApiProperty({ type: () => [Order] })
  @ManyToMany(() => Order, (orders) => orders.products)
  orders: Order[];
}
