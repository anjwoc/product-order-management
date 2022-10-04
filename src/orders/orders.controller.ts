import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RequestOrderDto } from './dto/request-order.dto';
import { PartialCancelOrderDto } from './dto/partial-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  requestOrder(@Body() requestOrderDto: RequestOrderDto) {
    return this.ordersService.requestOrder(requestOrderDto);
  }

  @Post('/cancel')
  partialCancelOrder(@Body() partialCancelOrderDto: PartialCancelOrderDto) {
    return this.ordersService.partialCancelOrder(partialCancelOrderDto);
  }

  @Post('/cancel-test')
  partialCancelOrderTest(@Body() partialCancelOrderDto: PartialCancelOrderDto) {
    return this.ordersService.partialCancelOrderTest(partialCancelOrderDto);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
