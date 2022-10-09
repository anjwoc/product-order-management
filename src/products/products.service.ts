import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dto/pagination-meta.dto';
import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';
import { PageDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = await this.productRepository.create(createProductDto);

    await this.productRepository.save(product);

    return product;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ProductDto>> {
    const { take, skip, orderBy } = pageOptionsDto;
    const [orders, itemCount] = await this.productRepository.findAndCount({
      take: take,
      skip: skip,
      order: { createdAt: orderBy },
      relations: ['products'],
    });

    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(orders, pageMeta);
  }

  async findOne(id: number): Promise<Product | undefined> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException('일치하는 상품이 없습니다.');
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<boolean> {
    const updatedRow = await this.productRepository.update(
      id,
      updateProductDto,
    );

    const isUpdated = updatedRow.affected > 0;

    return isUpdated;
  }

  async remove(id: number): Promise<boolean> {
    const deletedRow = await this.productRepository.delete(id);

    const isDeleted = deletedRow.affected > 0;

    return isDeleted;
  }
}
