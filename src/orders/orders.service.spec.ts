import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('등록되지 않은 상품으로 주문 요청', () => {})

  // 상품의 재고 > 주문 수량의 상태에서 주문

  // 상품의 재고 < 주문 수량의 상태에서 주문
});
