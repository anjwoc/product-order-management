import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './product.entity';
import { ProductDto } from './dto/product.dto';
import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';
import { PageDto } from 'src/common/dto/pagination.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/pagination.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: '상품 등록' })
  @ApiResponse({
    status: 201,
    description: '상품 등록 성공',
    type: CreateProductDto,
  })
  create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiPaginatedResponse(ProductDto)
  @ApiOperation({ summary: '상품 조회' })
  @ApiResponse({
    status: 200,
    description: '상품 조회 성공',
    type: [Product],
  })
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    return this.productsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '상품 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '상품 상세 조회 성공',
    type: Product,
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post(':id')
  @ApiOperation({ summary: '상품 수정' })
  @ApiResponse({
    status: 200,
    description: '상품 수정 성공',
    type: UpdateProductDto,
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '상품 삭제' })
  @ApiResponse({
    status: 200,
    description: '상품 삭제 성공',
    type: Number,
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
