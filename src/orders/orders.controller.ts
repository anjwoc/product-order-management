import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RequestOrderDto } from './dto/request-order.dto';
import { PartialCancelOrderDto } from './dto/partial-order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { PageDto } from 'src/common/dto/pagination.dto';
import { ApiResponseDto } from 'src/common/decorators/response-dto.decorator';
import { UpdateSuccessDto } from 'src/common/dto/update-success.dto';
import { DeleteSuccessDto } from 'src/common/dto/delete-success.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '주문 접수 요청' })
  @ApiResponseDto(OrderDto)
  @ApiResponse({
    status: 200,
    description: '주문 접수 성공',
  })
  requestOrder(@Body() requestOrderDto: RequestOrderDto): Promise<OrderDto> {
    return this.ordersService.requestOrder(requestOrderDto);
  }

  @Post('/complete/:id')
  @ApiOperation({ summary: '주문 완료 요청' })
  @ApiResponseDto(UpdateSuccessDto)
  @ApiResponse({
    status: 200,
    description: '주문 완료 요청 성공',
  })
  completeOrder(@Param('id') id: string): Promise<UpdateSuccessDto> {
    return this.ordersService.completeOrder(+id);
  }

  @Post('/cancel/:id')
  @ApiOperation({ summary: '주문 취소 요청' })
  @ApiResponseDto(UpdateSuccessDto)
  @ApiResponse({
    status: 200,
    description: '주문 취소 요청 성공',
  })
  cancelOrder(@Param('id') id: string): Promise<UpdateSuccessDto> {
    return this.ordersService.cancelOrder(id);
  }

  @Post('/partial-cancel')
  @ApiOperation({ summary: '상품 부분 취소 요청' })
  @ApiResponseDto(OrderDto)
  @ApiResponse({
    status: 200,
    description: '상품 부분 취소 요청 성공',
  })
  partialCancelOrder(
    @Body() partialCancelOrderDto: PartialCancelOrderDto,
  ): Promise<OrderDto> {
    return this.ordersService.partialCancelOrder(partialCancelOrderDto);
  }

  @Get()
  @ApiOperation({ summary: '주문 조회' })
  @ApiResponseDto(PageDto<OrderDto>)
  getOrderList(
    @Query() orderPaginationDto: OrderPaginationDto,
  ): Promise<PageDto<OrderDto>> {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세 조회' })
  @ApiResponseDto(OrderDto)
  @ApiResponse({
    status: 200,
    description: '주문 상세 조회 성공',
  })
  getOrderDetail(@Param('id') id: string): Promise<OrderDto> {
    return this.ordersService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '주문 수정' })
  @ApiResponseDto(UpdateSuccessDto)
  @ApiResponse({
    status: 200,
    description: '주문 수정 성공',
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<UpdateSuccessDto> {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '주문 삭제' })
  @ApiResponseDto(DeleteSuccessDto)
  @ApiResponse({
    status: 200,
    description: '주문 삭제 성공',
  })
  remove(@Param('id') id: string): Promise<DeleteSuccessDto> {
    return this.ordersService.remove(+id);
  }
}
