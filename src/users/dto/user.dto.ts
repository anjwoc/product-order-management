import { OmitType } from '@nestjs/mapped-types';
import { User } from '../user.entity';

export class UserDto extends OmitType(User, ['orders', 'password']) {}
