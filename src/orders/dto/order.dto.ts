import { PickType } from '@nestjs/mapped-types';
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
