import { OmitType } from '@nestjs/swagger';
import { Product } from '../product.entity';

export class FindProductDto extends OmitType(Product, ['orders'] as const) {}
