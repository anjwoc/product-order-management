import { OmitType } from '@nestjs/mapped-types';
import { Product } from '../product.entity';

export class CreateProductDto extends OmitType(Product, ['orders'] as const) {}
