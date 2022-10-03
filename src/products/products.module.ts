import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { User } from 'src/users/user.entity';
import { Order } from 'src/orders/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
