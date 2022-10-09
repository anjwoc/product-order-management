import { PickType } from '@nestjs/swagger';
import { Order } from '../order.entity';

export class OrderDto extends PickType(Order, [
  'id',
  'receiverName',
  'receiverAddress',
  'receiverPhone',
  'orderStatus',
  'products',
  'user',
]) {}
