import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersConsumer } from './orders.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/product.entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product]),
    BullModule.registerQueue({
      name: 'order',
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersConsumer],
})
export class OrdersModule {}
