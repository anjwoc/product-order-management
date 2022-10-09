import { PickType } from '@nestjs/mapped-types';
import { User } from '../user.entity';

export class UserRegisterDto extends PickType(User, [
  'email',
  'username',
  'password',
  'phoneNumber',
]) {}
