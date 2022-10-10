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
import { ProductDto } from './dto/product.dto';
import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';
import { PageDto } from 'src/common/dto/pagination.dto';
import { ApiResponseDto } from 'src/common/decorators/response-dto.decorator';
import { UpdateResult } from 'typeorm';
import { UpdateSuccessDto } from 'src/common/dto/update-success.dto';
import { DeleteSuccessDto } from 'src/common/dto/delete-success.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: '상품 등록' })
  @ApiResponseDto(ProductDto)
  @ApiResponse({
    status: 201,
    description: '상품 등록 성공',
  })
  create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: '상품 조회' })
  @ApiResponseDto(PageDto<ProductDto>)
  @ApiResponse({
    status: 200,
    description: '상품 조회 성공',
  })
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    return this.productsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '상품 상세 조회' })
  @ApiResponseDto(ProductDto)
  @ApiResponse({
    status: 200,
    description: '상품 상세 조회 성공',
  })
  findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productsService.findOne(+id);
  }

  @Post(':id')
  @ApiOperation({ summary: '상품 수정' })
  @ApiResponseDto(UpdateSuccessDto)
  @ApiResponse({
    status: 200,
    description: '상품 수정 성공',
  })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateSuccessDto> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '상품 삭제' })
  @ApiResponseDto(DeleteSuccessDto)
  @ApiResponse({
    status: 200,
    description: '상품 삭제 성공',
  })
  remove(@Param('id') id: string): Promise<DeleteSuccessDto> {
    return this.productsService.remove(+id);
  }
}
