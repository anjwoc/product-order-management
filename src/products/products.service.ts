import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DeleteSuccessDto } from 'src/common/dto/delete-success.dto';
import { PageMetaDto } from 'src/common/dto/pagination-meta.dto';
import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';
import { PageDto } from 'src/common/dto/pagination.dto';
import { UpdateSuccessDto } from 'src/common/dto/update-success.dto';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectDataSource()
    private connection: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager
        .getRepository(Product)
        .create(createProductDto);

      await queryRunner.manager.getRepository(Product).save(product);

      return product;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ProductDto>> {
    const { take, skip, orderBy } = pageOptionsDto;
    const [orders, itemCount] = await this.productRepository.findAndCount({
      take: take,
      skip: skip,
      order: { createdAt: orderBy },
    });

    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(orders, pageMeta);
  }

  async findOne(id: number): Promise<ProductDto> {
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
  ): Promise<UpdateSuccessDto> {
    const updatedRow = await this.productRepository.update(
      id,
      updateProductDto,
    );

    const isUpdated = updatedRow.affected > 0;

    return new UpdateSuccessDto(isUpdated);
  }

  async remove(id: number): Promise<DeleteSuccessDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!id) {
        throw new BadRequestException('상품 번호가 없습니다.');
      }

      const product = await queryRunner.manager
        .getRepository(Product)
        .findOne({ where: { id: id } });

      if (!product) {
        throw new NotFoundException('삭제할 상품이 없습니다.');
      }

      const deletedRow = await queryRunner.manager
        .getRepository(Product)
        .softDelete(id);

      const isDeleted = deletedRow.affected > 0;

      await queryRunner.commitTransaction();

      return new DeleteSuccessDto(isDeleted);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
