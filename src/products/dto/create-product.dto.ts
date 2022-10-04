import { OmitType, PickType } from '@nestjs/mapped-types';
import { Product } from '../product.entity';

export class CreateProductDto extends Product {}
