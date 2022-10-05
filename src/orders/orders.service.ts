import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { DataSource, Repository, UpdateResult } from 'typeorm';
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

    @InjectDataSource()
    private connection: DataSource,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order | undefined> {
    const order = await this.orderRepository.create(createOrderDto);

    await this.orderRepository.save(order);

    return order;
  }

  async requestOrder(requestOrderDto: RequestOrderDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { products, ...params } = requestOrderDto;

    try {
      const orderProducts = await queryRunner.manager
        .getRepository(Product)
        .createQueryBuilder('product')
        .where('product.id IN (:...ids)', { ids: products })
        .getMany();

      if (!orderProducts) {
        throw new BadRequestException('주문 가능한 상품이 없습니다.');
      }

      if (!(products.length === orderProducts.length)) {
        throw new BadRequestException('일부 상품이 등록된 상품이 아닙니다.');
      }

      const order = await queryRunner.manager.getRepository(Order).create({
        ...params,
        products: orderProducts,
      });

      await queryRunner.manager.getRepository(Order).save(order);
      await queryRunner.commitTransaction();

      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async partialCancelOrder(
    partialCancelOrderDto: PartialCancelOrderDto,
  ): Promise<Order> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { orderId, products } = partialCancelOrderDto;

    try {
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
      await queryRunner.commitTransaction();

      return partialCancel;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async partialCancelOrderTest(
    partialCancelOrderDto: PartialCancelOrderDto,
  ): Promise<UpdateResult> {
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

    const partialCancel = await this.orderRepository.update(orderId, order);

    return partialCancel;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find({ relations: ['products'] });

    return orders;
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new BadRequestException('존재하지 않는 주문번호입니다.');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<boolean> {
    const updatedRow = await this.orderRepository.update(id, updateOrderDto);

    const isUpdated = updatedRow.affected > 0;

    return isUpdated;
  }

  async remove(id: number): Promise<boolean> {
    const deletedRow = await this.orderRepository.delete(id);

    const isDeleted = deletedRow.affected > 0;

    if (!isDeleted) {
      throw new BadRequestException('존재하지 않는 주문 번호입니다.');
    }

    return isDeleted;
  }
}
