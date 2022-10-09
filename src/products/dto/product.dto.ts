import { OmitType } from '@nestjs/swagger';
import { Product } from '../product.entity';

export class ProductDto extends OmitType(Product, ['orders'] as const) {}
