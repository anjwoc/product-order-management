import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('order')
export class OrdersConsumer {
  private readonly logger = new Logger(OrdersConsumer.name);

  printOrderReuqest(order) {
    const {
      receiverName: name,
      receiverPhone: phoneNumber,
      receiverAddress: address,
      products,
    } = order;

    this.logger.debug('================주문 정보=============');
    console.table([
      {
        수령인: name,
        연락처: phoneNumber,
        주소: address,
        상품정보: products.map((item) => item.name),
      },
    ]);
    this.logger.debug('======================================');
  }

  printOrderCancel(products) {
    this.logger.debug('================주문 취소 결과==========');
    this.logger.debug('================취소된 상품 리스트======');
    console.table(
      products.map((item) => {
        return {
          '상품 번호': item.id,
          '상품 이름': item.name,
          '상품 가격': item.price,
        };
      }),
    );
    this.logger.debug('======================================');
  }

  @Process('requestOrder')
  processOrder(job: Job) {
    this.printOrderReuqest(job.data);
  }

  @Process('partialCancelOrder')
  partialCancelOrdr(job: Job) {
    this.printOrderCancel(job.data);
  }
}
