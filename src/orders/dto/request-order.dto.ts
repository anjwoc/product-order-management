import { ApiProperty, PickType } from '@nestjs/swagger';
import { Order } from '../order.entity';

export class RequestOrderDto extends PickType(Order, [
  'receiverName',
  'receiverPhone',
  'receiverAddress',
]) {
  @ApiProperty({ type: () => [Number], description: '상품 번호 리스트' })
  products: number[];
}
