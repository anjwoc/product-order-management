import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { RequestOrderDto } from './dto/request-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order | undefined> {
    const order = await this.orderRepository.create(createOrderDto);

    await this.orderRepository.save(order);

    return order;
  }

  async requestOrder(requestOrderDto: RequestOrderDto) {
    const { products, ...params } = requestOrderDto;
    const orderProudcts = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id IN (:...ids)', { ids: products })
      .getMany();

    const order = await this.orderRepository.create({
      ...params,
      products: orderProudcts,
    });

    await this.orderRepository.save(order);

    return order;
  }

  async findAll() {
    const orders = await this.orderRepository.find({ relations: ['products'] });

    return orders;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
