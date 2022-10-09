import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { PageMetaDto } from 'src/common/dto/pagination-meta.dto';
import { PageDto } from 'src/common/dto/pagination.dto';
import { UpdateSuccessDto } from 'src/common/dto/update-success.dto';
import { Product } from 'src/products/product.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { OrderDto } from './dto/order.dto';
import { PartialCancelOrderDto } from './dto/partial-order.dto';
import { RequestOrderDto } from './dto/request-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';
import { OrderStatus } from './order.status';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectDataSource()
    private connection: DataSource,

    @InjectQueue('order')
    private orderQueue: Queue,
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

      this.orderQueue.add('requestOrder', order);

      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(id: string): Promise<UpdateSuccessDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedRow = await queryRunner.manager
        .getRepository(Order)
        .update(id, {
          orderStatus: OrderStatus.CANCELED,
        });

      const isUpdaetd = updatedRow.affected > 0;

      return { success: isUpdaetd };
    } catch (err) {
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
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
      const order = await queryRunner.manager.getRepository(Order).findOne({
        where: { id: orderId },
        relations: ['products'],
      });

      if (!order) {
        throw new BadRequestException('존재하지 않는 주문 번호입니다.');
      }

      const cancelProducts = [];
      const remaining = [];
      order.products.forEach((order) => {
        if (!products.includes(order.id)) {
          remaining.push(order);
          return;
        }

        cancelProducts.push(order);
      });

      if (!remaining) {
        throw new BadRequestException('취소할 상품이 없습니다.');
      }

      order.products = remaining;

      const partialCancel = await queryRunner.manager
        .getRepository(Order)
        .save(order);
      await queryRunner.commitTransaction();

      this.orderQueue.add('partialCancelOrder', cancelProducts);

      return partialCancel;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async completeOrder(id: number): Promise<boolean> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedRow = await queryRunner.manager
        .getRepository(Order)
        .update(id, {
          orderStatus: OrderStatus.COMPLETED,
        });

      const isUpdaetd = updatedRow.affected > 0;

      return isUpdaetd;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    pageOptionsDto: OrderPaginationDto,
  ): Promise<PageDto<OrderDto>> {
    const { take, skip, orderBy, orderStatus } = pageOptionsDto;
    const [orders, itemCount] = await this.orderRepository.findAndCount({
      where: {
        orderStatus: orderStatus,
      },
      take: take,
      skip: skip,
      order: { createdAt: orderBy },
      relations: ['products'],
    });

    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(orders, pageMeta);
  }

  async findOne(id: number): Promise<Order> {
    if (!id) {
      throw new BadRequestException('주문 번호가 없습니다.');
    }

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('존재하지 않는 주문번호입니다.');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<boolean> {
    if (!id) {
      throw new BadRequestException('주문 번호가 없습니다.');
    }

    const updatedRow = await this.orderRepository.update(id, updateOrderDto);

    const isUpdated = updatedRow.affected > 0;

    return isUpdated;
  }

  async remove(id: number): Promise<boolean> {
    if (!id) {
      throw new BadRequestException('주문 번호가 없습니다.');
    }

    const deletedRow = await this.orderRepository.delete(id);

    const isDeleted = deletedRow.affected > 0;

    if (!isDeleted) {
      throw new BadRequestException('존재하지 않는 주문 번호입니다.');
    }

    return isDeleted;
  }
}
