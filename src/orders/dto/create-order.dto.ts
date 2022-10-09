import { OmitType } from '@nestjs/swagger';
import { Order } from '../order.entity';

export class CreateOrderDto extends OmitType(Order, ['orderStatus', 'user']) {}
