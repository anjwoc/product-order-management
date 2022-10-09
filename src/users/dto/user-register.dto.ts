import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '../user.entity';

export class UserRegisterDto extends PickType(User, [
  'email',
  'username',
  'phoneNumber',
] as const) {
  @IsNotEmpty()
  password: string;

  @IsOptional()
  isAdmin: boolean;
}
