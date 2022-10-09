import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '../user.entity';

export class UserRegisterDto extends PickType(User, [
  'email',
  'username',
  'phoneNumber',
] as const) {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  isAdmin: boolean;
}
