import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { PartialCancelOrderDto } from './dto/partial-order.dto';
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

    if (!orderProudcts) {
      throw new BadRequestException('주문 가능한 상품이 없습니다.');
    }

    if (!(products.length === orderProudcts.length)) {
      throw new BadRequestException('일부 상품이 등록된 상품이 아닙니다.');
    }

    const order = await this.orderRepository.create({
      ...params,
      products: orderProudcts,
    });

    await this.orderRepository.save(order);

    return order;
  }

  async partialCancelOrder(
    partialCancelOrderDto: PartialCancelOrderDto,
  ): Promise<Order> {
    const { orderId, products } = partialCancelOrderDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['products'],
    });

    if (!order) {
      throw new BadRequestException('존재하지 않는 주문 번호입니다.');
    }

    const filteredProducts = order.products.filter(
      (order) => !products.includes(order.id),
    );

    if (!filteredProducts) {
      throw new BadRequestException('취소할 상품이 없습니다.');
    }

    order.products = filteredProducts;

    const partialCancel = await this.orderRepository.save(order);

    return partialCancel;
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
