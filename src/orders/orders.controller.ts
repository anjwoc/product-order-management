import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/pagination.decorator';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
@ApiTags('Orders')
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
  @ApiPaginatedResponse(OrderDto)
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.ordersService.getOrderList(pageOptionsDto);
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
