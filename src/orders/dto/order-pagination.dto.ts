import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';
import { OrderStatus } from '../order.status';

export class OrderPaginationDto extends PageOptionsDto {
  @ApiProperty({
    type: 'string',
    description: '주문 상태',
    enum: ['READY', 'COMPLETED', 'CANCELED'],
  })
  status: string;

  get orderStatus(): OrderStatus {
    return OrderStatus[this.status];
  }
}
