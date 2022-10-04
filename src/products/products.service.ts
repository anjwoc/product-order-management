import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<number | undefined> {
    const product = await this.productRepository.create(createProductDto);

    await this.productRepository.save(product);

    return product.id;
  }

  async findAll(): Promise<Product[] | undefined> {
    const products = await this.productRepository.find();

    return products;
  }

  async findOne(id: number): Promise<Product | undefined> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new BadRequestException('일치하는 상품이 없습니다.');
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
