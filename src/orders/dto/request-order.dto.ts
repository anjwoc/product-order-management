import { PartialType, PickType } from '@nestjs/mapped-types';
import { Order } from '../order.entity';

export class RequestOrderDto extends PickType(Order, [
  'receiverName',
  'receiverPhone',
  'receiverAddress',
]) {
  products: number[];
}
