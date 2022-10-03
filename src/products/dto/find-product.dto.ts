import { OmitType } from '@nestjs/mapped-types';
import { Product } from '../product.entity';

export class FindProductDto extends OmitType(Product, ['orders'] as const) {}
