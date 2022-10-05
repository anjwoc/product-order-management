import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';
import { OrderStatus } from '../order.status';

export class OrderPaginationDto extends PageOptionsDto {
  status: string;

  get orderStatus(): OrderStatus {
    return OrderStatus[this.status];
  }
}
