import { OmitType } from '@nestjs/swagger';
import { Product } from '../product.entity';

export class CreateProductDto extends OmitType(Product, [
  'orders',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
