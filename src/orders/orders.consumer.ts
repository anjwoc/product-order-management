import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('order')
export class OrdersConsumer {
  private readonly logger = new Logger(OrdersConsumer.name);

  printOrder(order) {
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

  @Process('requestOrder')
  processOrder(job: Job) {
    this.printOrder(job.data);
  }

  @Process('partialCancelOrder')
  partialCancelOrdr(job: Job) {
    console.log('');
  }
}
