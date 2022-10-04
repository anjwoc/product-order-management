import { OmitType } from '@nestjs/mapped-types';
import { Order } from '../order.entity';

export class CreateOrderDto extends OmitType(Order, ['orderStatus', 'user']) {}
