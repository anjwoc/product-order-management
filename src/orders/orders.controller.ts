import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RequestOrderDto } from './dto/request-order.dto';
import { PartialCancelOrderDto } from './dto/partial-order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/pagination.decorator';
import { OrderDto } from './dto/order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { Order } from './order.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '주문 접수 요청' })
  @ApiResponse({
    status: 200,
    description: '주문 접수 성공',
    type: RequestOrderDto,
  })
  requestOrder(@Body() requestOrderDto: RequestOrderDto) {
    return this.ordersService.requestOrder(requestOrderDto);
  }

  @Post('/complete/:id')
  @ApiOperation({ summary: '주문 완료 요청' })
  @ApiResponse({
    status: 200,
    description: '주문 완료 요청 성공',
    type: Boolean,
  })
  completeOrder(@Param('id') id: string): Promise<boolean> {
    return this.ordersService.completeOrder(+id);
  }

  @Post('/cancel')
  @ApiOperation({ summary: '주문 취소 요청' })
  @ApiResponse({
    status: 200,
    description: '주문 취소 요청 성공',
    type: Boolean,
  })
  partialCancelOrder(
    @Body() partialCancelOrderDto: PartialCancelOrderDto,
  ): Promise<Order> {
    return this.ordersService.partialCancelOrder(partialCancelOrderDto);
  }

  @Get()
  @ApiOperation({ summary: '주문 조회' })
  @ApiPaginatedResponse(OrderDto)
  getOrderList(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '주문 상세 조회 성공',
    type: Order,
  })
  getOrderDetail(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: '주문 생성' })
  @ApiResponse({
    status: 201,
    description: '주문 생성 성공',
    type: Order,
  })
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '상품 수정' })
  @ApiResponse({
    status: 200,
    description: '상품 수정 성공',
    type: Boolean,
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<boolean> {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '주문 삭제' })
  @ApiResponse({
    status: 200,
    description: '주문 삭제 성공',
    type: Boolean,
  })
  remove(@Param('id') id: string): Promise<boolean> {
    return this.ordersService.remove(+id);
  }
}
