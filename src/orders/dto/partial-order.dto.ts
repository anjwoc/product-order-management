import { ApiProperty } from '@nestjs/swagger';

export class PartialCancelOrderDto {
  @ApiProperty({ type: 'number', description: '주문 번호' })
  orderId: number;
  @ApiProperty({ type: () => [Number], description: '상품 아이디 리스트' })
  products: number[];
}
